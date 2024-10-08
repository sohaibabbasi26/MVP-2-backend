const CodingAssessment = require("../models/codingAssessment");
const CodingResults = require("../models/codingResults");
const Customer = require("../models/customer");
const Questions = require("../models/questions");
const Test = require("../models/test");
const {
  convertTextToQuestionArray,
} = require("../utilities/convTextToQuesArray");
const { processJob } = require("../utilities/cronJob");
const { getCompletion, getCodingVerifiedCompletion } = require("../utilities/OpenAIgateways");
const {
  createPrompt,
  CodingAssignmentPrompt,
  CodingExcersiceVerificationPrompt,
} = require("../utilities/promptHelper");
const { refineApiResponseForCoding } = require("../utilities/refinedCodingResults");
const { SimpleQueue } = require("../utilities/TemporaryQueue");
const { transcribeAudio } = require("../utilities/transcribeAudio");
const axios = require("axios");

require("dotenv").config();

const resultQueue = new SimpleQueue();

async function getRandomQuestions(
  expertise,
  limit,
  customer_id
  //position_id,
  //question
) {
  const prompt = createPrompt(expertise);
  console.log(prompt);
  //console.log("position id in get random questions method:", position_id);

  try {
    const completion = await getCompletion(prompt);
    console.log("completion: ", completion.choices[0].message);
    const data = completion.choices[0].message.content;

    const finalData = convertTextToQuestionArray(data);

    const reqBody = {
      expertise,
      //   position_id,
      customer_id,
      question: finalData,
    };

    console.log("request body:", reqBody);

    try {
      const submitQuestions = await Questions.create({
        question: finalData,
        //position_id: position_id,
        customer_id,
      });
      console.log(submitQuestions);
      return { status: 200, message: submitQuestions };
    } catch (err) {
      console.log("ERROR that is faced:", err);
      return {
        status: 500,
        message: "Failed to update questions in the db table.",
      };
    }
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    // throw new Error("Failed to generate question");
    return {
      status: 500,
      message: "OpenAI Error: " + err.message,
    };
  }
}

const getCandidateTestQuestionService = async (candidate_id) => {
  const customer = await Customer.findOne({
    where: {
      customer_id: candidate_id,
    },
  });

  if (!customer) {
    return {
      status: 404,
      message: "customer not found",
    };
  }

  const questions = await Questions.findOne({
    where: {
      customer_id: candidate_id,
    },
  });

  if (questions) {
    return {
      status: 200,
      data: questions.question,
    };
  }

  return {
    status: 404,
    message: "question not found",
  };
};

async function takeTest({ question_answer, candidate_id }) {
  try {
    const check = await Customer.findOne({
      where: { customer_id: candidate_id },
    });
    // const checkTwo = await db.candidate_self.findOne({
    //     where: { candidate_self_id: candidate_id },
    // });

    //if (check || checkTwo) {
    if (check) {
      let test;
      try {
        test = await Test.create({
          question_answer,
          customer_id: candidate_id,
        });
        console.log("Test:", test.test_id);

        let job;
        job = {
          question_answer: question_answer,
          customer_id: candidate_id,
          testId: test.test_id,
        };
        resultQueue.enqueue(job);

        processJob(job);

        return {
          status: 200,
          message: "Test is being processed",
          jobId: test.test_id,
        };
      } catch (err) {
        console.error("Error creating test in DB:", err);
        return {
          status: 500,
          message: "Failed to create test.",
        };
      }
    } else {
      return {
        status: 404,
        message: "customer not found",
      };
    }
  } catch (err) {
    console.error("Error in takeTest:", err);
    return {
      status: 500,
      message: "An error occurred during the test process.",
    };
  }
}

async function speechToTextGeneration(audioFilename) {
  if (!audioFilename) {
    throw new Error("No file name detected!");
  }

  try {
    console.log("In service file!");
    const transcription = await transcribeAudio(audioFilename);
    if (!transcription || !transcription.text) {
      console.log("Transcription failed or returned undefined.");
      return "Transcription failed.";
    }
    console.log("Transcription:", transcription.text);
    return transcription.text;
  } catch (err) {
    console.error("Error in SpeechToTextGeneration:", err);
    return "Error during transcription.";
  }
}

const getCodingQuestionService = async (candidate_id) => {
  try {
    const prompt = await CodingAssignmentPrompt();
    console.log("Prompt for coding assignment:", prompt);
    if (prompt) {
      try {
        const completion = await getCompletion(prompt);
        console.log("COMPLETION:", completion.choices[0].message);
        const data = completion.choices[0].message.content;

        let JsonifiedData;
        try {
          JsonifiedData = await JSON.parse(data);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError, "Raw data:", data);
        }
        console.log("jsonified data:", JsonifiedData);

        const reqBody = {
          assessment: JsonifiedData,
          //position_id: position_id,
          customer_id: candidate_id,
        };

        try {
          const setAssessment = await CodingAssessment.create(reqBody);
          console.log("assessment:", setAssessment);
          return {
            status: 200,
            message: "coding of a freelancer fetched",
            codingQuestion: setAssessment,
          };
        } catch (err) {
          console.log("ERR:", err);
          return {
            status: 500,
            message: err.message,
          };
        }
        return JsonifiedData;
      } catch (err) {
        console.log("ERR:", err);
        return {
          status: 500,
          message: err.message,
        };
      }
    }
  } catch (err) {
    console.log("ERROR:", err);
    return {
      status: 500,
      message: err.message,
    };
  }
};

async function executeCode({
  language,
  script
}) {
  const program = {
      script: script,
      language: language,
      stdin: "",
      versionIndex: "0",
      clientId: process.env.EXECUTE_CODE_CLIENT_ID,
      clientSecret: process.env.EXECUTE_CODE_CLIENT_SECRET,
  };

  try {
      const response = await axios({
          method: "POST",
          url: "https://api.jdoodle.com/v1/execute",
          data: program,
          headers: {
              "Content-Type": "application/json",
          },
      });

      console.log("response:", response);
      console.log("OUTPUT:", response.data.output);

      return { status: 200, data: response.data };
  } catch (error) {
      console.error(error);
      return {
          status: error.response?.status || 500,
          message: error.message,
      };
  }
}

async function getCodingSubmit({
  code,
  exercise,
  constraints,
  output,
  candidate_id,
}) {
  try {
      const prompt = await CodingExcersiceVerificationPrompt(
          code,
          exercise,
          constraints,
          output
      );
      const completion = await getCodingVerifiedCompletion(prompt);
      const data = completion.choices[0].message.content
          .replace(/```/g, "")
          .trim();

      console.log(" data:", data);

      let JsonifiedData;
      try {
          // JsonifiedData = JSON.parse(data);
          JsonifiedData = await refineApiResponseForCoding(data);
      } catch (parseError) {
          console.error(
              "Error parsing JSON:",
              parseError,
              "Raw data:",
              data
          );
          return { error: parseError.message, rawData: data };
      }

      const dataEntry = await CodingResults.create({
          result: JsonifiedData,
          customer_id: candidate_id,
      });
      console.log("Data entered in the DB table:", dataEntry);
      return dataEntry;
  } catch (err) {
      console.error("ERR:", err);
      return { error: err.message };
  }
}

module.exports = {
  getRandomQuestions,
  getCandidateTestQuestionService,
  takeTest,
  speechToTextGeneration,
  getCodingQuestionService,
  executeCode,
  getCodingSubmit
};
