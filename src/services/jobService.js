const { Op } = require("sequelize");
const Adminassigned = require("../models/admin_assigned_client_customer");
const JobPostings = require("../models/jobPostings");
const Customer = require("../models/customer");
const Client = require("../models/client");
const { calculateDays } = require("../utilities/calculateDays");

const getAllJobsService = async () => {
    const result = await JobPostings.findAll();
    return {
        status: 200,
        result
    }
}

const getJobCandidates = async (query) => {

    //this will be used by admin
    //association
    JobPostings.belongsTo(Client, { foreignKey: "client_id" });
    Client.hasMany(JobPostings, { foreignKey: "client_id" });

    let res = null
    if (query?.job_status === 'hired-and-trial') {
        res = getJobStatusHiredAndTrial(query.client_id, query?.candidate_id)
    }
    if (query?.job_status === 'all') {
        res = getJobStatusAll(query.client_id)
    }
    if (query?.job_status !== 'hired-and-trial' && query?.job_status != 'all') {
        res = getJobStatus(query?.job_status, query?.client_id)
    }

    if (res) {
        return res
    }
    return {
        status: 500,
        message: 'Invalid request'
    }
}

const getJobStatus = async (job_status, client_id) => {

    let accepted_candidates = null;
    if (client_id) {
        accepted_candidates = await JobPostings.findAll({
            where: {
                client_id,
                job_status
            }
        });
    } else {
        accepted_candidates = await JobPostings.findAll({
            where: {
                job_status
            },
            include: {
                model: Client,
            }
        });
    }

    if (accepted_candidates && accepted_candidates.length > 0 && accepted_candidates?.assigned_customer && accepted_candidates?.assigned_customer?.length > 0) {
        let result = []
        //get customer info
        let customer_info = null;
        for (let j = 0; j < accepted_candidates?.length; j++) {
            let job = accepted_candidates[j];
            const assigned_customer = job?.assigned_customer
            for (let i = 0; i < assigned_customer?.length; i++) {
                customer_info = await Customer.findByPk(assigned_customer[i].customer_id)
            }
            let days_passed = 0;
            if (job_status === "hired" || job_status === "trial") {
                days_passed = calculateDays(job?.updatedAt)
            }
            result.push({
                customer_info,
                client: job?.client,
                job,
                days_passed
            })
        }

        return {
            status: 200,
            message: 'hired-and-trial candidates',
            data: result
        }
    }

    return {
        status: 404,
        message: 'No candidates hired yet'
    }

}

const getJobStatusAll = async (client_id) => {

    let accepted_candidates = null;
    if (client_id) {
        accepted_candidates = await JobPostings.findAll({
            where: {
                client_id
            }
        });
    } else {
        accepted_candidates = await JobPostings.findAll({
            include: {
                model: Client,
            }
        });
    }

    if (accepted_candidates && accepted_candidates.length > 0 && accepted_candidates?.assigned_customer && accepted_candidates?.assigned_customer?.length > 0) {
        let result = []
        let customer_info = null
        //get customer info
        for (let j = 0; j < accepted_candidates?.length; j++) {
            let job = accepted_candidates[j];
            const assigned_customer = job?.assigned_customer
            for (let i = 0; i < assigned_customer?.length; i++) {
                customer_info = await Customer.findByPk(assigned_customer[i].customer_id)
            }
            result.push({
                customer_info,
                client: job?.client,
                job,
            })
        }

        return {
            status: 200,
            message: 'all job candidates',
            data: result
        }
    }

    return {
        status: 404,
        message: 'No candidates hired yet'
    }

}

const getJobStatusHiredAndTrial = async (client_id, candidate_id) => {

    let accepted_candidates = null;
    if (client_id) {
        accepted_candidates = await JobPostings.findAll({
            where: {
                [Op.and]: {
                    client_id,
                    [Op.or]: {
                        job_status: 'hired',
                        job_status: 'trial'
                    },
                }
            }
        });
    }else{
        accepted_candidates = await JobPostings.findAll({
            where: {
                [Op.or]: {
                    job_status: 'hired',
                    job_status: 'trial'
                },
            },
            include: {
                model: Client,
            }
        });

    }
    if (accepted_candidates && accepted_candidates.length > 0) {
        let result = []
        //get customer info
        let customer_info = null
        for (let j = 0; j < accepted_candidates?.length; j++) {
            if (accepted_candidates[j].assigned_customer && accepted_candidates[j].assigned_customer?.length > 0) {
                let job = accepted_candidates[j];
                const assigned_customer = job?.assigned_customer
                for (let i = 0; i < assigned_customer?.length; i++) {
                    if(candidate_id){
                        customer_info = await Customer.findByPk(candidate_id)
                    }else{

                        customer_info = await Customer.findByPk(assigned_customer[i].customer_id)
                    }
                }
                const days_passed = calculateDays(job?.updatedAt)
                result.push({
                    customer_info,
                    client: job?.client,
                    job,
                    days_passed
                })
            }
        }

        console.log(result)

        return {
            status: 200,
            message: 'hired-and-trial candidates',
            data: result
        }
    }

    return {
        status: 404,
        message: 'No candidates hired yet'
    }

}

module.exports = {
    getAllJobsService,
    getJobCandidates
}