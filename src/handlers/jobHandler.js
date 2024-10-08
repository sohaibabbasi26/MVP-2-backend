const jobService = require('../services/jobService')

const getAllJobs=async (req,res)=>{
    const result= await jobService.getAllJobsService();
    res.status(result.status).send({
        result: [...result.result]
    })
}

const getJobCandidates= async(req,res)=>{
    try{
        const query= req.query;
        const result= await jobService.getJobCandidates(query);
        res.status(result.status).send({...result})
    }catch(e){
        res.status(500).send({
            message: e.message
        })
    }
}

module.exports={
    getAllJobs,
    getJobCandidates
}