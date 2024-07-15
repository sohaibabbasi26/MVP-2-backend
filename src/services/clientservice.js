const Client = require("../models/client")

const getClientByIdService=async(id)=>{
    const client= await Client.findOne({
        attributes:['client_location','name','account_user_name','email','contact_no','status','approved','createdAt','updatedAt'],
        where:{
            client_id: id
        }
    });

    //const client= await Client.findByPk(id);

    if(client){
        return client;
    }else{
        return null;
    }
}

module.exports={
    getClientByIdService
}