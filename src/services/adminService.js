const Client = require("../models/client");
const { Client_Requests } = require("../models/client_requests");
const Customer = require("../models/customer");

const approveCustomerService = async (customer_id) => {
  try {
    const is_approved = await Customer.update(
      { is_approved: true },
      {
        where: {
          customer_id,
        },
      }
    );

    if (is_approved > 0) {
      return {
        is_approved:true,
        message: "customer has been approved"
      };
    } else {
        return {
            is_approved:true,
            message: "customer not been approved"
          };
    }
  } catch (error) {
    console.log('error at root project -> services -> adminService.js');
    console.log(error);
  }
};


const fetchClientRequestService= async()=>{
  try{
    const client_request= await Client_Requests.findAll();

  if(client_request){
    return{
      status: 200,
      message: client_request
    }
  }else{
    return{
      status: 404,
      message: "no client requests yet"
    }
  }
  }catch(err){
    console.log('error at root project -> services -> adminService.js');
    console.log(err);
    return{
      status: 500,
      message: err
    }
  }
  
}

module.exports={
    approveCustomerService,
    fetchClientRequestService
}
