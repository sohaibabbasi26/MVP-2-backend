const { sequelize } = require("../../configurations/sequelizePgSQL");
const Customer = require("../models/customer");
const Client = require("../models/client");
const Admin = require("../models/admin");
const Questions = require("../models/questions");
const JobPostings = require("../models/jobPostings");
const Test = require("../models/test");
const CodingResults = require("../models/codingResults");
const Results = require("../models/results");
// const Assessment = require('')
const Assessments = require("../models/assessments");
const { checkCustomerInDb } = require("../utilities/checkCustomerExists");
const { checkClientInDb } = require("../utilities/checkClientInDb");
const { encryptPasword } = require("../utilities/encryptPassword");
const { jwtSignature } = require("../utilities/jwtSign");
const { comparePassword } = require("../utilities/passwordCompare");
const { checkAdminInDb } = require("../utilities/checkAdminInDb");
const {
  getCompletion,
  getCodingVerifiedCompletion,
} = require("../utilities/OpenAIgateways");
const {
  convertTextToQuestionArray,
} = require("../utilities/convTextToQuesArray");
const {
  createPrompt,
  CodingAssignmentPrompt,
  CodingExcersiceVerificationPrompt,
} = require("../utilities/promptHelper");
const { processJob } = require("../utilities/cronJob");
const {
  refineApiResponseForCoding,
} = require("../utilities/refinedCodingResults");
const { generateCodeQues } = require("../utilities/generateCodeQues");
const transporter = require("../../configurations/gmailConfig");
const { SimpleQueue } = require("../utilities/TemporaryQueue");

async function customerSignup(data) {
  try {
    const {
      name,
      email,
      password,
      //contact_no,
      method,
    } = data;
    const isCustomerInDb = await checkCustomerInDb(email, method);
    if (isCustomerInDb === true) {
      return {
        status: 409,
        message: "User with these credentials already exists",
      };
    } else {
      try {
        const hashedPassword = await encryptPasword(password);
        const newData = {
          name,
          email,
          password: hashedPassword,
          //contact_no,
        };
        const result = await Customer.create(newData);
        jwtSignature(result?.dataValues);
        return {
          status: 200,
          message: '"User has been created successfully."',
        };
      } catch (err) {
        console.log(
          "ERROR WHILE CREATING CUSTOMER:",
          err,
          "\n error source :  error source: src -> services -> primaryServices -> signup"
        );
        return "ERROR WHILE CREATING CUSTOMER:", err;
      }
    }
  } catch (err) {
    console.log(
      "some error occured while signing up:",
      err,
      "\n error source: src -> services -> primaryServices -> signup"
    );
    return "Some error occured while signing up";
  }
}

async function clientSignup(data) {
  try {
    const {
      name,
      //client_location,
      email,
      password,
      //contact_no,
      method,
    } = data;
    const isClientInDb = await checkClientInDb(email, method);
    if (isClientInDb === true) {
      return {
        status: 409,
        message: `Client with these credentials already exists`,
      };
    } else {
      try {
        const hashedPassword = await encryptPasword(password);
        const newData = {
          name,
          //client_location,
          email,
          password: hashedPassword,
          //contact_no,
        };
        const result = await Client.create(newData);
        jwtSignature(result?.dataValues);
        return {
          status: 200,
          message: "CLIENT has been created successfully.",
        };
      } catch (err) {
        console.log(
          "ERROR WHILE CREATING CLIENT:",
          err,
          "\n error source :  error source: src -> services -> primaryServices -> signup"
        );
        return "ERROR WHILE CREATING CLIENT:", err;
      }
    }
  } catch (err) {
    console.log(
      "some error occured while signing up:",
      err,
      "\n error source: src -> services -> primaryServices -> signup"
    );
    return "Some error occured while signing up";
  }
}

async function adminSignup(data) {
  try {
    const { email, password, method } = data;
    const isAdminInDb = await checkAdminInDb(email, method);
    if (isAdminInDb === true) {
      return `Admin with these credentials already exists`;
    } else {
      try {
        const hashedPassword = await encryptPasword(password);
        const newData = {
          email,
          password: hashedPassword,
        };
        const result = await Admin.create(newData);
        jwtSignature(result?.dataValues);
        return "Admin has been created successfully.";
      } catch (err) {
        console.log(
          "ERROR WHILE CREATING ADMIN:",
          err,
          "\n error source :  error source: src -> services -> primaryServices -> signup"
        );
        return "ERROR WHILE CREATING ADMIN:", err;
      }
    }
  } catch (e) {
    console.log(
      "SOME ERROR OCCURED:",
      e,
      "\n Error source: src -> services -> primaryServices -> login "
    );
    return "SOME ERROR OCCURED:", e;
  }
}

async function customerLogin(data) {
  try {
    const { email, password, method } = data;
    const fetchedCustomer = await checkCustomerInDb(email, method);
    if (fetchedCustomer) {
      try {
        const compareAndCheck = await comparePassword(
          password,
          fetchedCustomer?.password
        );
        if (!compareAndCheck) {
          return {
            status: 403,
            message: "Invalid Password",
          };
        } else {
          const token = await jwtSignature(fetchedCustomer.dataValues); // Pass customer_id and email
          return {
            status: 200,
            message: "Customer logged in successfully",
            token: token,
            id: fetchedCustomer?.customer_id,
            data,
          };
        }
      } catch (err) {
        console.log(
          "ERR:",
          err,
          "\n Error source: src -> services -> primaryServices -> login"
        );
        return "ERROR WHILE LOGGING IN:", err;
      }
    } else {
      return {
        status: 404,
        message: "Client not found",
      };
    }
  } catch (err) {
    console.log(
      "SOME ERROR OCCURED:",
      err,
      "\n Error source: src -> services -> primaryServices -> login "
    );
    return "SOME ERROR OCCURED:", err;
  }
}

async function clientLogin(data) {
  try {
    const { email, password, method } = data;
    const fetchedClient = await checkClientInDb(email, method);
    if (fetchedClient) {
      try {
        const compareAndCheck = await comparePassword(
          password,
          fetchedClient?.password
        );
        if (!compareAndCheck) {
          return {
            status: 403,
            message: "Invalid Password",
          };
        } else {
          const token = await jwtSignature(fetchedClient?.dataValues);
          return {
            status: 200,
            message: "Client logged in successfully",
            token: token,

            id: fetchedClient?.client_id,
            email: fetchedClient?.email,
            name: fetchedClient?.name,
          };
        }
      } catch (err) {
        console.log(
          "ERR:",
          err,
          "\n Error source: src -> services -> primaryServices -> login"
        );
        return "ERROR WHILE LOGGING IN:", err;
      }
    } else {
      return {
        status: 404,
        message: "Client not found",
      };
    }
  } catch (err) {
    console.log(
      "SOME ERROR OCCURED:",
      err,
      "\n Error source: src -> services -> primaryServices -> login "
    );
    return "SOME ERROR OCCURED:", err;
  }
}

async function adminLogin(data) {
  try {
    const { email, password, method } = data;
    const fetchedAdmin = await checkAdminInDb(email, method);
    if (fetchedAdmin) {
      try {
        const compareAndCheck = await comparePassword(
          password,
          fetchedAdmin?.password
        );
        if (!compareAndCheck) {
          return "Invalid password";
        } else {
          const token = await jwtSignature(fetchedAdmin?.dataValues);
          return token;
        }
      } catch (err) {
        console.log(
          "ERR:",
          err,
          "\n Error source: src -> services -> primaryServices -> login"
        );
        return "ERROR WHILE LOGGING IN:", err;
      }
    } else {
      return "Admin not found";
    }
  } catch (err) {
    console.log(
      "SOME ERROR OCCURED:",
      err,
      "\n Error source: src -> services -> primaryServices -> login "
    );
    return "SOME ERROR OCCURED:", err;
  }
}

async function getRandomQuestionsService(data) {
  const { expertise, difficulty, limit, job_posting_id } = data;
  const prompt = createPrompt(expertise, difficulty, limit);
  try {
    const completion = await getCompletion(prompt);
    console.log("completion: ", completion.choices[0].message);
    const data = completion.choices[0].message.content;
    const finalData = convertTextToQuestionArray(data);

    const reqBody = {
      expertise,
      job_posting_id,
      question: finalData,
    };
    console.log("request body:", reqBody);
    try {
      const submitQuestions = await Questions.create({
        question: finalData,
        job_posting_id: job_posting_id,
      });
      console.log("\nQUESTIONS SAVED IN DB:", submitQuestions);
      return { status: 200, message: submitQuestions };
    } catch (err) {
      console.log("ERROR WHILE SUBMITTING TO DB:", err, "\n ");
      return {
        status: 500,
        message: "Failed to update questions in the db table.",
      };
    }
  } catch (err) {
    console.error(
      "OpenAI Error:",
      err.message,
      "\nError source: src -> services -> primaryServices -> getRandomQuestionsService"
    );
    throw new Error("Failed to generate question");
  }
}

async function sendMailService(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return error;
    } else {
      console.log("Email sent:", info.response);
      return;
    }
  });
}

async function createPositionsService(data) {
  const {
    position,
    client_id,
    expertise,
    job_type,
    description,
    status,
    applied_customers_count,
    location,
    is_test_required,
    application_questions,
    start_date,
    project_length,
    workday_overlap
  } = data;

  try {
    const check = await Client.findOne({
      where: {
        client_id: client_id,
      },
    });

    if (check) {
      const requestBody = {
        position,
        client_id,
        expertise,
        job_type,
        description,
        status,
        applied_customers_count,
        location,
        is_test_required,
        start_date,
        project_length,
        application_questions,
        workday_overlap
      };
      console.log("request body: ", requestBody);
      try {
        const result = await JobPostings.create(requestBody);
        return { statusCode: 200, data: result?.dataValues };
      } catch (e) {
        console.log(
          "Failed to create a job posting",
          e,
          "\nError source: src -> services -> primaryServices -> createPositionsService"
        );
        return "Failed to create a job posting", e;
      }
    } else {
      return {
        statusCode: 404,
        message: "Unauthorized access to make a job posting.",
      };
    }
  } catch (error) {
    console.log(error);
    return "Failed to create a job posting";
  }
}

async function takeTest({ question_answer, customer_id, job_posting_id }) {
  "";
  const resultQueue = new SimpleQueue();
  try {
    const checkTwo = await Customer.findOne({
      where: { customer_id },
    });

    if (checkTwo) {
      let test;
      try {
        test = await Test.create({
          question_answer,
          customer_id,
        });
        console.log("Test:", test.dataValues.test_id);

        let job;
        job = {
          question_answer: question_answer,
          customer_id: customer_id,
          testId: test.dataValues.test_id,
        };
        resultQueue.enqueue(job);

        processJob(job, job_posting_id, resultQueue);

        return {
          message: "Test is being processed",
          jobId: test.dataValues.test_id,
        };
      } catch (err) {
        console.error("Error creating test in DB:", err);
        return {
          statusCode: 500,
          message: "Failed to create test.",
        };
      }
    } else {
      console.log(
        "A customer with and id:",
        customer_id,
        " is not found in the DB."
      );
      return "A customer with and id:", customer_id, " is not found in the DB.";
    }
  } catch (err) {
    console.error("Error in takeTest:", err);
    return {
      statusCode: 500,
      message: "An error occurred during the test process.",
    };
  }
}

async function getCodingQuestionService({ job_posting_id, customer_id }) {
  try {
    const prompt = await CodingAssignmentPrompt();
    console.log("Prompt for coding assignment:", prompt);
    if (prompt) {
      try {
        const JsonifiedData = await generateCodeQues(prompt);
        const reqBody = {
          assesment: JsonifiedData,
          job_posting_id: job_posting_id,
        };

        try {
          const setAssessment = await Assessments.create(reqBody);
          console.log("assessment:", setAssessment);
          console.log("assessment created:", setAssessment?.dataValues);
          return JsonifiedData;
        } catch (err) {
          console.log(
            "Error while creating assessment:",
            err,
            "\nError source: src -> services -> primaryServices -> getCodingQuestion"
          );
          return (
            "Error while creating assessment:",
            err,
            "\nError source: src -> services -> primaryServices -> getCodingQuestion"
          );
        }
      } catch (err) {
        console.log(
          "Some server side error occured:",
          err,
          "\nError source: src -> services -> primaryServices -> getCodingQuestion"
        );
        return (
          "Some server side error occured:",
          err,
          "\nError source: src -> services -> primaryServices -> getCodingQuestion"
        );
      }
    }
  } catch (err) {
    console.log("ERROR:", err);
    return;
  }
}

async function getCodingVerifiedService({
  code,
  exercise,
  constraints,
  output,
  customer_id,
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
      JsonifiedData = await refineApiResponseForCoding(data);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError, "Raw data:", data);
      return { error: parseError.message, rawData: data };
    }

    const dataEntry = await CodingResults.create({
      result: JsonifiedData,
      customer_id: customer_id,
    });
    console.log("Data entered in the DB table:", dataEntry);
    return dataEntry;
  } catch (err) {
    console.log(
      "ERROR while verifying the provided code:",
      err,
      "\nError source: src -> services -> primaryServices.js -> getCodingVerified"
    );
    return "ERROR while verifying the provided code:", err;
  }
}

async function getCustomerResultService({ customer_id }) {
  try {
    const check = await Customer.findOne({
      where: {
        customer_id: customer_id,
      },
    });

    if (!check) {
      console.log("No customer found with id:", customer_id);
      return {
        message: "No such customer available.",
      };
    } else {
      try {
        const result = await Results.findOne({
          where: {
            customer_id: customer_id,
          },
        });
        console.log("the fetched results are:", result?.dataValues);
        return {
          message: result?.dataValues,
        };
      } catch (err) {
        console.log(
          "Error while finding the client's result:",
          err,
          "\nError source: src -> services -> primaryServices.js -> getCustomerResultService"
        );
        return {
          message: "Error while finding the client:",
          err,
        };
      }
    }
  } catch (err) {
    console.log(
      "Error while finding the requested client's info:",
      err,
      "\nError source: src -> services -> primaryServices.js -> getCustomerResultService"
    );
    return "Error while finding the requested client's info:", err;
  }
}

async function setHourlyRateService({ customer_id, hourly_rate }) {
  try {
    const check = await Customer.findOne({
      where: {
        customer_id: customer_id,
      },
    });
    console.log("found customer:", check?.dataValues);

    if (!check) {
      console.log("No customer found with id:", customer_id);
      return {
        message: "No such customer available.",
      };
    } else {
      try {
        const result = await Customer.update(
          {
            hourly_rate: hourly_rate,
          },
          {
            where: {
              customer_id: customer_id,
            },
          }
        );
        console.log("the customer table is updated", result);
        return {
          message: "Hourly-rate has been successfully set.",
          response: result,
        };
      } catch (err) {
        console.log(
          "Error while finding the customer:",
          err,
          "\nError source: src -> services -> primaryServices.js -> getCustomerResultService"
        );
        return {
          message: "Error while finding the customer:",
          err,
        };
      }
    }
  } catch (err) {
    console.log(
      "Error while finding the requested client's info:",
      err,
      "\nError source: src -> services -> primaryServices.js -> getCustomerResultService"
    );
    return "Error while finding the requested client's info:", err;
  }
}

async function setExpertiseService({ expertise, customer_id }) {
  const customer = await Customer.findOne({
    where: {
      customer_id: customer_id,
    },
  });

  try {
    if (!customer) {
      return "no such customer was found in the db";
    } else {
      const result = await Customer.update(
        {
          expertise: expertise,
        },
        {
          where: {
            customer_id: customer_id,
          },
        }
      );

      if (result[0] > 0) {
        ``;
        return `New expertise updated for customer ID: ${customer_id}`;
      } else {
        throw new Error(
          "No update performed. It is possible the customer ID did not match."
        );
      }
    }
  } catch (err) {
    console.log(
      "ERROR occured during updating the expertise of a customer:",
      err,
      "\nError source: src -> services -> primaryServices.js -> setExpertiseService"
    );
    return "ERROR occured during updating the expertise of a customer:", err;
  }
}

async function setExperienceService({ experience, customer_id }) {
  const customer = await Customer.findOne({
    where: {
      customer_id: customer_id,
    },
  });

  try {
    if (!customer) {
      return "no such customer was found in the db";
    } else {
      const result = await Customer.update(
        {
          experience: experience,
        },
        {
          where: {
            customer_id: customer_id,
          },
        }
      );

      if (result[0] > 0) {
        ``;
        return `New experience updated for customer ID: ${customer_id}`;
      } else {
        throw new Error(
          "No update performed. It is possible the customer ID did not match."
        );
      }
    }
  } catch (err) {
    console.log(
      "ERROR occured during updating the experience of a customer:",
      err,
      "\nError source: src -> services -> primaryServices.js -> setExperienceService"
    );
    return "ERROR occured during updating the experience of a customer:", err;
  }
}

async function updatecustomer_service(body, customer_id) {
  const data = await Customer.findOne({
    where: {
      customer_id: customer_id,
    },
  });
  if (!data) {
    console.log(
      "customer not found => src->services->customer->updatecustomer_service"
    );
  }

  await data.update(body);
  return body;
}

module.exports = {
  customerSignup,
  clientSignup,
  customerLogin,
  clientLogin,
  adminSignup,
  adminLogin,
  getRandomQuestionsService,
  createPositionsService,
  setExpertiseService,
  sendMailService,
  takeTest,
  getCodingQuestionService,
  getCodingVerifiedService,
  getCustomerResultService,
  setHourlyRateService,
  setExperienceService,
  updatecustomer_service,
};
