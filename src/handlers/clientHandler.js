const Client = require("../models/client");
const { getallclients } = require("../services/clientservice");
//Client Api
async function clients(req, res) {
  const data = await getallclients();
  res.send(data);
}
module.exports = {
  clients,
};
