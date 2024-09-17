const services = require("../services/primaryServices");
const { checkAdminInDb } = require("../utilities/checkAdminInDb");
const { checkClientInDb } = require("../utilities/checkClientInDb");
const { checkCustomerInDb } = require("../utilities/checkCustomerExists");
const jwt = require("jsonwebtoken");

async function serverCheck(req, res) {
  try {
    res.send("SERVER IS RUNNING!");
  } catch (err) {
    console.log("ERROR:", err);
    return;
  }
}

async function signup(req, res) {
  try {
    const data = req?.body;
    console.log("data:", data);
    if (data?.user_role === "customer") {
      const result = await services.customerSignup(data);
      res.status(result.status).send(result);
    } else if (data?.user_role === "client") {
      const result = await services.clientSignup(data);
      res.status(result.status).send(result);
    } else if (data?.user_role === "admin") {
      const result = await services.adminSignup(data);
      res.status(result.status).send(result);
    }
  } catch (err) {
    console.log("ERROR:", err);
    return;
  }
}

async function login(req, reply) {
  try {
    const data = req?.body;
    console.log("data:", data);

    let result;

    if (data?.user_role === "customer") {
      result = await services.customerLogin(data);
    } else if (data?.user_role === "client") {
      result = await services.clientLogin(data);
    } else if (data?.user_role === "admin") {
      result = await services.adminLogin(data);
    }

    if (result.status===200) {
      // Set both token and user_role cookies
      reply.setCookie("token", result, {
        httpOnly: true,
        sameSite: "Strict",
      });
      reply.setCookie("user_role", data.user_role, {
        httpOnly: true,
        sameSite: "Strict",
      });
    }

    return reply
      .status(result.status)
      .send({ ...result });
  } catch (err) {
    console.error("ERROR:", err);
    return reply
      .status(500)
      .send({ message: "Internal Server Error", error: err.message });
  }
}
async function verifyToken(req, reply) {
  try {
    const token =
      req.headers["authorization"]?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return reply
        .status(401)
        .send({ message: "Access Denied: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded; // Attach the decoded token data to the request object
  } catch (err) {
    return reply.status(401).send({ message: "Invalid Token" });
  }
}

function checkRole(...roles) {
  return async function (req, reply) {
    try {
      console.log("Request cookies:", req.cookies);
      const userRole = req.cookies.user_role;
      console.log("User role #################:", userRole);
      if (!userRole) {
        console.log("No user role found.");
        return reply
          .status(401)
          .send({ message: "Access Denied: Invalid User Role" });
      }

      await verifyToken(req, reply);

      console.log("Checking roles:", roles, "User role:", userRole);
      if (!roles.includes(userRole)) {
        console.log("User does not have the required role.");
        return reply.status(403).send({
          message: "Access Denied: Insufficient Permissions For This User",
        });
      }

      // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Error occurred in checkRole:", error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  };
}

async function getRandomQuestions(req, res) {
  try {
    const data = req?.body;
    const result = await services.getRandomQuestionsService(data);
    res.send(result);
  } catch (e) {
    console.log(
      "Internal Server Error Occured:",
      e,
      "\n Error source -> src -> handlers -> primaryHandlers"
    );
    res.send("Internal Server Error Occured:", e);
  }
}

async function createPositions(req, res) {
  try {
    const data = req?.body;
    const result = await services.createPositionsService(data);
    res.send(result);
  } catch (e) {
    console.log(
      "Internal Server Error Occured:",
      e,
      "\n Error source -> src -> handlers -> primaryHandlers"
    );
    res.send("Internal Server Error Occured:", e);
  }
}

async function sendMail(req, res) {
  try {
    const { to, subject, text } = req.body;
    const mailOptions = {
      from: "sobiabbasi22@gmail.com",
      to,
      subject,
      text,
    };

    // if (user_role === "client") {
    //   const client = await checkClientInDb(to);
    //   if (client === true) {
        const result = await services.sendMailService(mailOptions);
        res.status(result.status).send({
          ...result
        });
    //   } else {
    //     res.send("Client not found.");
    //   }
    // } else if (user_role === "admin") {
    //   const admin = await checkAdminInDb(to);
    //   if (admin === true) {
        // const result = await services.sendMailService(mailOptions);
        // res.send("Email sent successfully.");
    //   } else {
    //     res.send("Admin not found.");
    //   }
    // } else if (user_role === "customer") {
    //   const customer = await checkCustomerInDb(to);
    //   if (customer === true) {
    //     const result = await services.sendMailService(mailOptions);
    //     res.send("Email sent successfully.");
    //   } else {
    //     res.send("Customer not found.");
    //   }
    // } else {
    //   res.status(400).send("Invalid user role specified");
    // }
  } catch (e) {
    console.log("Internal Server Error Occurred:", e);
    res.status(500).send("Internal Server Error Occurred");
  }
}

async function takeTest(req, res) {
  try {
    const { question_answer, customer_id, job_posting_id } = req.body;
    const sent = await services.takeTest({
      question_answer,
      customer_id,
      job_posting_id,
    });
    res.send(sent);
  } catch (e) {
    console.log(
      "Error in handler:",
      e,
      "\nError source: src -> handlers -> primarHandlers -> takeTest"
    );
    return "Error in handler:", e;
  }
}

async function getCodingQuestion(request, reply) {
  try {
    const { job_posting_id } = request?.body;
    const result = await services.getCodingQuestionService({ job_posting_id });
    reply.status(200).send(result);
  } catch (err) {
    console.log(
      "ERROR while handling the route:",
      err,
      "\nError source: src -> handlers -> primaryHandlers.js -> getCodingQuestion"
    );
    return "ERROR while handling the route:", err;
  }
}

async function getCodingVerified(request, reply) {
  try {
    const { code, exercise, constraints, output, customer_id } = request?.body;
    const result = await services.getCodingVerifiedService({
      code,
      exercise,
      constraints,
      output,
      customer_id,
    });
    reply.status(200).send(result);
  } catch (err) {
    console.log(
      "ERROR while handling the route:",
      err,
      "\nError source: src -> handlers -> primaryHandlers.js -> getCodingVerified"
    );
    return "ERROR while handling the route:", err;
  }
}

async function getCustomerResult(request, reply) {
  try {
    const { customer_id } = request?.query;
    const result = await services.getCustomerResultService({ customer_id });
    reply.status(200).send(result);
  } catch (err) {
    console.log(
      "Some error occured while handling the route",
      err,
      "\nError source: src -> handlers -> primaryHandlers.js -> getCustomerResult"
    );
    return "Some error occured while handling the route", err;
  }
}

async function setHourlyRate(request, reply) {
  try {
    const { customer_id, hourly_rate } = request?.body;
    const result = await services.setHourlyRateService({
      customer_id,
      hourly_rate,
    });
    reply.status(200).send(result);
  } catch (err) {
    console.log(
      "Some error occured while handling the route",
      err,
      "\nError source: src -> handlers -> primaryHandlers.js -> setHourlyRate"
    );
    return "Some error occured while handling the route", err;
  }
}

async function setExpertise(request, reply) {
  try {
    const { customer_id, expertise } = request?.body;
    const result = await services.setExpertiseService({
      customer_id,
      expertise,
    });
    reply.status(200).send(result);
  } catch (err) {
    console.log(
      "Some error occured while handling the route",
      err,
      "\nError source: src -> handlers -> primaryHandlers.js -> setExpertise"
    );
    return "Some error occured while handling the route", err;
  }
}

async function setExperience(request, reply) {
  try {
    const { customer_id, experience } = request?.body;
    const result = await services.setExperienceService({
      customer_id,
      experience,
    });
    reply.status(200).send(result);
  } catch (err) {
    console.log(
      "Some error occured while handling the route",
      err,
      "\nError source: src -> handlers -> primaryHandlers.js -> setExperience"
    );
    return "Some error occured while handling the route", err;
  }
}

async function customer_updateprofile(req, res) {
  const body = req.body;
  const customer_id = req.params.customer_id;

  if (body.password) {
    delete body.password;
  }
  if (body.email) {
    delete body.email;
  }

  try {
    const data = await services.updatecustomer_service(body, customer_id);
    res.status(200).send({ data, message: "Profile Updated Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while updating the profile." });
  }
}

module.exports = {
  serverCheck,
  signup,
  login,
  getRandomQuestions,
  createPositions,
  sendMail,
  getCodingQuestion,
  takeTest,
  getCodingVerified,
  getCustomerResult,
  setHourlyRate,
  setExpertise,
  setExperience,
  customer_updateprofile,
  checkRole,
};
