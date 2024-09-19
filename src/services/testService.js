const Customer = require("../models/customer");
const Questions = require("../models/questions");
const {
  convertTextToQuestionArray,
} = require("../utilities/convTextToQuesArray");
const { getCompletion } = require("../utilities/OpenAIgateways");
const { createPrompt } = require("../utilities/promptHelper");

require("dotenv").config();

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
      message: "OpenAI Error: "+err.message,
    };
  }
}

const getCandidateTestQuestionService=async(candidate_id)=>{
  const customer = await Customer.findOne({
    where: {
      customer_id: candidate_id,
    },
  });

  if(!customer){
    return{
      status: 404,
      message: 'customer not found'
    }
  }

  const questions= await Questions.findOne({
    where:{
      customer_id: candidate_id,
    }
  });

  if(questions){
    return {
      status: 200,
      data: questions.question
    }
  }

  return {
    status: 404,
    message:"question not found"
  }
}

module.exports = {
  getRandomQuestions,
  getCandidateTestQuestionService
};
