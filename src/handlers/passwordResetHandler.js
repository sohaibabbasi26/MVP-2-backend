const { resetPassword } = require("../services/resetPasswordService");

const resetPasswordHandler= async(req,res)=>{
    try{
        const updatePassword=await resetPassword(req.body);
        res.status(updatePassword.status).send({
            message:updatePassword.message
        })
    }catch(error){
        console.log("root_project -> handlers -> passwordResetHandler.js")
        res.status(403).send({
            message:error
        })
    }
}

module.exports={
    resetPasswordHandler
}