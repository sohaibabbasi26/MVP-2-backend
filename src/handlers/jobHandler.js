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
        console.log(e)
        res.status(500).send({
            message: e.message
        })
    }
}

const closeJob= async(req,res)=>{
    
    const result= await jobService.closeJobService(req?.body);
    res.status(result.status).send({
        status: result?.status,
        message: result?.message
    })
}

const getJobHistory= async(req,res)=>{
    
    const result= await jobService.getJobHistoryService(req?.query);
    res.status(result.status).send({...result})
}

module.exports={
    getAllJobs,
    getJobCandidates,
    closeJob,
    getJobHistory
}