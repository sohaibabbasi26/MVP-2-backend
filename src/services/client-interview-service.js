const ClientInterview = require("../models/client_interview_scheduling");

async function client_interview_scheduling_service(body) {
  try {
    const schedule = new ClientInterview(body);
    await schedule.save();
    // return { message: "Successfully Created Schedule" };
    if (schedule) {
      return { message: "Successfully Scheduled an Interview" };
    } else {
      return {
        message: "Table not created",
      };
    }
  } catch (error) {
    console.log(`Error while inserting data ${error}`);
  }
}

module.exports = { client_interview_scheduling_service };
