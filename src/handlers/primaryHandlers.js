const services = require('../services/primaryServices');
const { checkAdminInDb } = require('../utilities/checkAdminInDb');
const { checkClientInDb } = require('../utilities/checkClientInDb');
const { checkCustomerInDb } = require('../utilities/checkCustomerExists');

async function serverCheck(req, res) {
    try {
        res.send("SERVER IS RUNNING!")
    }
    catch (err) {
        console.log("ERROR:", err);
        return;
    }
}

async function signup(req, res) {
    try {
        const data = req?.body;
        console.log("data:", data);
        if (data?.user_role === 'customer') {
            const result = await services.customerSignup(data);
            res.send(result);
        }
        else if (data?.user_role === 'client') {
            const result = await services.clientSignup(data);
            res.send(result);
        }
        else if (data?.user_role === 'admin') {
            const result = await services.adminSignup(data);
            res.send(result);
        }
    }
    catch (err) {
        console.log("ERROR:", err);
        return;
    }
}



async function login(req, res) {
    try {
        const data = req?.body;
        console.log("data:", data);

        if (data?.user_role === 'customer') {
            const result = await services.customerLogin(data);
            res.send(result);
        }
        else if (data?.user_role === 'client') {
            const result = await services.clientLogin(data);
            res.send(result);
        }
        else if (data?.user_role === 'admin') {
            const result = await services.adminLogin(data);
            res.send(result);
        }
    }
    catch (err) {
        console.log("ERROR:", err);
        return;
    }
}

async function getRandomQuestions(req, res) {
    try {
        const data = req?.body;
        const result = await services.getRandomQuestionsService(data);
        res.send(result);
    } catch (e) {
        console.log('Internal Server Error Occured:', e, '\n Error source -> src -> handlers -> primaryHandlers');
        res.send('Internal Server Error Occured:', e);
    }
}

async function createPositions(req, res) {
    try {
        const data = req?.body;
        const result = await services.createPositionsService(data);
        res.send(result);
    } catch (e) {
        console.log('Internal Server Error Occured:', e, '\n Error source -> src -> handlers -> primaryHandlers');
        res.send('Internal Server Error Occured:', e);
    }
}

async function sendMail(req, res) {
    try {
        const { to, subject, text, user_role } = req.body;
        const mailOptions = {
            from: "sobiabbasi22@gmail.com",
            to,
            subject,
            text,
        };

        if (user_role === 'client') {
            const client = await checkClientInDb(to);
            if (client === true) {
                const result = await services.sendMailService(mailOptions);
                res.send("Email sent successfully.");
            } else {
                res.send("Client not found.");
            }
        } else if (user_role === 'admin') {
            const admin = await checkAdminInDb(to);
            if (admin === true) {
                const result = await services.sendMailService(mailOptions);
                res.send("Email sent successfully.");
            } else {
                res.send("Admin not found.");
            }
        } else if (user_role === 'customer') {
            const customer = await checkCustomerInDb(to);
            if (customer === true) {
                const result = await services.sendMailService(mailOptions);
                res.send("Email sent successfully.");
            } else {
                res.send("Customer not found.");
            }
        } else {
            res.status(400).send("Invalid user role specified");
        }
    } catch (e) {
        console.log('Internal Server Error Occurred:', e);
        res.status(500).send('Internal Server Error Occurred');
    }
}

async function takeTest(req, res) {
    try {
        const { question_answer, customer_id, job_posting_id } = req.body;
        const sent = await services.takeTest({
            question_answer,
            customer_id,
            job_posting_id,
        });
        res.send(sent);
    } catch (e) {
        console.log("Error in handler:", e, "\nError source: src -> handlers -> primarHandlers -> takeTest");
        return "Error in handler:", e;
    }
}

async function getCodingQuestion(request, reply) {
    try {
        const { job_posting_id } = request?.body;
        const result = await services.getCodingQuestionService({ job_posting_id });
        reply.status(200).send(result);
    }
    catch (err) {
        console.log("ERROR while handling the route:", err, "\nError source: src -> handlers -> primaryHandlers.js -> getCodingQuestion");
        return "ERROR while handling the route:", err;
    }
}

async function getCodingVerified(request, reply) {
    try {
        const { code, exercise, constraints, output, customer_id } = request?.body;
        const result = await services.getCodingVerifiedService({ code, exercise, constraints, output, customer_id });
        reply.status(200).send(result);
    }
    catch (err) {
        console.log("ERROR while handling the route:", err, "\nError source: src -> handlers -> primaryHandlers.js -> getCodingVerified");
        return "ERROR while handling the route:", err;
    }
}

async function getCustomerResult(request, reply) {
    try {
        const { customer_id } = request?.query;
        const result = await services.getCustomerResultService({ customer_id });
        reply.status(200).send(result);
    } catch (err) {
        console.log('Some error occured while handling the route', err, "\nError source: src -> handlers -> primaryHandlers.js -> getCustomerResult");
        return "Some error occured while handling the route", err;
    }
}   

async function setHourlyRate(request, reply) {
    try {
        const { customer_id, hourly_rate } = request?.body;
        const result = await services.setHourlyRateService({ customer_id , hourly_rate});
        reply.status(200).send(result);
    } catch (err) {
        console.log('Some error occured while handling the route', err, "\nError source: src -> handlers -> primaryHandlers.js -> setHourlyRate");
        return "Some error occured while handling the route", err;
    }
}

async function setExpertise(request,reply){
    try{
        const { customer_id, expertise } = request?.body;
        const result = await services.setExpertiseService({ customer_id , expertise});
        reply.status(200).send(result);
    } catch (err){
        console.log('Some error occured while handling the route', err, "\nError source: src -> handlers -> primaryHandlers.js -> setExpertise");
        return "Some error occured while handling the route", err;
    }
}

async function setExperience(request,reply){
    try{
        const { customer_id, experience } = request?.body;
        const result = await services.setExperienceService({ customer_id , experience });
        reply.status(200).send(result);
    } catch (err){
        console.log('Some error occured while handling the route', err, "\nError source: src -> handlers -> primaryHandlers.js -> setExperience");
        return "Some error occured while handling the route", err;
    }
}

async function profileInfoUpdate(request,reply){
    try{
        const { customer_id, prop, value } = request?.body;
        const result = await services.profileInfoUpdateService({ customer_id , prop, value });
        reply.status(200).send(result);
    } catch (err){
        console.log('Some error occured while handling the route', err, "\nError source: src -> handlers -> primaryHandlers.js -> profileInfoUpdate");
        return "Some error occured while handling the route", err;
    }
}

module.exports = {
    serverCheck,
    signup,
    login,
    getRandomQuestions,
    createPositions,
    sendMail,
    getCodingQuestion,
    takeTest,
    getCodingVerified,
    getCustomerResult,
    setHourlyRate,
    setExpertise,
    setExperience,
    profileInfoUpdate
}