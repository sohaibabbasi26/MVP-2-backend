const AdminInterview = require("../models/admin_interview_scheduling");
const {
  admin_interview_scheduling_service,
} = require("../services/admin-interview-service");

//interview api
async function admininterview(req, res) {
  try {
    const data = req.body;
    if (!data.customer_id || !data.customer_email) {
      // Ensure email is provided
      return res
        .status(400)
        .send({ message: "Customer_Id and Customer_Email must not be empty" });
    } else {
      const result = await admin_interview_scheduling_service(data);
      res.send(result);
    }
  } catch (error) {
    console.log(`Error while posting ${error}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
}
module.exports = { admininterview };
