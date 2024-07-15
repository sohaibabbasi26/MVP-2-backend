const { getallclients } = require("../services/clientservice");
//Client Api
async function clients(req, res) {
  try {
    const data = await getallclients();
    res.send(data);
  } catch (error) {
    console.log(`Error while getting clients data ${error}`);
    return;
  }
}
module.exports = {
  clients,
};
