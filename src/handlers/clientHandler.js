const {
  getallclients,
  updateclient_service,
} = require("../services/clientservice");

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

//Client update_profile
async function client_updateprofile(req, res) {
  const body = req.body;
  const client_id = req.params.client_id;

  if (body.password) {
    delete body.password;
  }

  try {
    const data = await updateclient_service(body, client_id);
    res.status(200).send({ data, message: "Profile Updated Successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while updating the profile." });
  }
}

module.exports = {
  clients,
  client_updateprofile,
};
