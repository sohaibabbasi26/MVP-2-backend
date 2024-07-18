const { adminassignedservice } = require("../services/adminservice");
const AdminInterview = require("../models/admin_interview_scheduling");

async function adminassignedhandler(req, res) {
  try {
    const data = req.body;
    const result = await adminassignedservice(data);
    res.send(result);
  } catch (error) {
    console.error("Error in admin-assigned-handler:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const {
  admin_interview_scheduling_service,
} = require("../services/adminservice");

//interview api
async function admininterview(req, res) {
  try {
    const data = req.body;
    if (!data.customer_id || !data.customer_email || !data.interview_time) {
      // Ensure email is provided
      return res.status(400).send({
        message:
          "Customer_Id, Customer_Email, Interview_time must not be empty",
      });
    } else {
      const result = await admin_interview_scheduling_service(data);
      res.send(result);
    }
  } catch (error) {
    console.log(`Error while posting ${error}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

module.exports = { adminassignedhandler, admininterview };
