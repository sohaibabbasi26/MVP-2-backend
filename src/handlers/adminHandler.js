const { approveCustomerService, fetchClientRequestService } = require("../services/adminService");

const approveCustomerHandler= async(req,res)=>{
    const {customer_id}= req.body;

    if(customer_id){
        const customerApproveService= await approveCustomerService(customer_id);
        let statusCode= 200;
        if(!customerApproveService.is_approved){
            statusCode=404;
        }
        res.status(statusCode).send({
            is_approved:customerApproveService.is_approved,
            message:"customer approved"
        })
    }else{
        res.status(403).rend({
            message:"invalid customer id"
        })
    }
}

const fetchClientRequestHandler= (req,res)=>{
    fetchClientRequestService()
    .then((result)=>{
        res.status(result.status)
        .send(result.message);
    })
    .catch((err)=>{
        res.status(500)
        .send(err);
    })
}

module.exports={
    approveCustomerHandler,
    fetchClientRequestHandler
}