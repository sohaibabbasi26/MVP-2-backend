const Customer = require("../models/customer");

const getCustomerByIdService=async(id)=>{
    const client= await Customer.findOne({
        attributes:['customer_id','name','over_all_exp','email','contact_no','applied_through','expertise','position','createdAt','updatedAt'],
        where:{
            customer_id: id
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
    getCustomerByIdService
}