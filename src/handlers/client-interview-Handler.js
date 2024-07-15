const ClientInterview = require("../models/client_interview_scheduling");
const {
  client_interview_scheduling_service,
} = require("../services/client-interview-service");

//interview api
async function clientinterview(req, res) {
  try {
    const data = req.body;
    if (!data.customer_id) {
      return { message: "Customer_Id must not be empty" };
    } else {
      const result = await client_interview_scheduling_service(data);
      res.send(result);
    }
  } catch (error) {
    console.log(`Error while posting  ${error}`);
    return;
  }
}
module.exports = { clientinterview };
