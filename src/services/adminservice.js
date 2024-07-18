const Adminassigned = require("../models/admin_assigned_client_customer");
const AdminInterview = require("../models/admin_interview_scheduling");
const { sendMail } = require("../handlers/primaryHandlers");

async function admin_interview_scheduling_service(body) {
  try {
    const schedule = await AdminInterview.create(body);
    if (schedule) {
      const emailData = {
        to: body.customer_email,
        subject: "Interview Scheduled",
        text: `   Dear Candidate,
                      
                    Your interview is scheduled on ${body.interview_date} at ${body.interview_time}.
              
        Thank you,
        Co-VenTech`,

        user_role: `customer`,
      };

      // Send the email
      await sendMail(
        { body: emailData },
        {
          send: (result) => console.log(result),
          status: (code) => ({ send: (message) => console.log(message) }),
        }
      );

      return { message: "Successfully Scheduled an Interview" };
    } else {
      return { message: "Table not created" };
    }
  } catch (error) {
    console.log(`Error while inserting data ${error}`);
  }
}

async function adminassignedservice(body) {
  try {
    const data = await Adminassigned.create(body);
    return data, { message: `Customer is assigned to Client` };
  } catch (e) {
    console.error(`Error while creating data: ${e.message}`, e);
    throw e; // Ensure the error is propagated
  }
}

module.exports = { adminassignedservice, admin_interview_scheduling_service };
