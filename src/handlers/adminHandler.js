const { approveCustomerService } = require("../services/adminService");

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

module.exports={
    approveCustomerHandler
}