const { getClientByIdService, createClientRequestService } = require("../services/clientService");

const getClientById = async (req, res) => {
  try {
    const { client_id } = req.query;
    const client = await getClientByIdService(client_id);

    if (client) {
        res.status(200).send(
            client
        )
    }
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};


const createClientRequestHandler=(req,res)=>{
  try{
    createClientRequestService(req.body)
    .then((result)=>{
      res.status(result.status).send({
        message: result.message
      })
    })
  }catch(err){
    console.log("error in root_project -> src -> handlers -> clientHandler.js");
    res.status(500).send({
      message: err
    })
  }
}

module.exports = {
  getClientById,
  createClientRequestHandler
};
