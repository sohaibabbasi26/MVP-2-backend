const Adminassigned = require("../models/admin_assigned_client_customer");

async function adminassignedservice(body) {
  try {
    const data = await Adminassigned.create(body);
    return data, { message: `Customer is assigned to Client` };
  } catch (e) {
    console.error(`Error while creating data: ${e.message}`, e);
    throw e; // Ensure the error is propagated
  }
}

module.exports = { adminassignedservice };
