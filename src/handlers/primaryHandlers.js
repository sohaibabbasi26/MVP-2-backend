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
                res.send( "Email sent successfully.");
            } else {
                res.send("Client not found.");
            }
        } else if (user_role === 'admin') {
            const admin = await checkAdminInDb(to);
            if (admin === true) {
                const result = await services.sendMailService(mailOptions);
                res.send( "Email sent successfully.");
            } else {
                res.send("Admin not found.");
            }
        } else if (user_role === 'customer') {
            const customer = await checkCustomerInDb(to);
            if (customer === true) {
                const result = await services.sendMailService(mailOptions);
                res.send( "Email sent successfully.");
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
module.exports = {
    serverCheck,
    signup,
    login,
    getRandomQuestions,
    createPositions,
    sendMail
}