const Client = require("../models/client");
//Client Api
async function getallclients(req, res) {
  try {
    const result = await Client.findAll();
    return result;
  } catch (error) {
    console.log(`Error while retrieving client data ${error}`);
    return;
  }
}
module.exports = {
  getallclients,
};
