const jobService = require('../services/jobService')

const getAllJobs=async (req,res)=>{
    const result= await jobService.getAllJobsService();
    res.status(result.status).send({
        result: [...result.result]
    })
}

module.exports={
    getAllJobs
}