const { sequelize } = require('../../configurations/sequelizePgSQL');
const Customer = require('../models/customer');
const Client = require('../models/client');
const Admin = require('../models/admin');
const Questions = require('../models/questions');
const { checkCustomerInDb } = require('../utilities/checkCustomerExists');
const { checkClientInDb } = require('../utilities/checkClientInDb');
const { encryptPasword } = require('../utilities/encryptPassword');
const { jwtSignature } = require('../utilities/jwtSign');
const { comparePassword } = require('../utilities/passwordCompare');
const { checkAdminInDb } = require('../utilities/checkAdminInDb');
const { getCompletion } = require('../utilities/OpenAIgateways');
const { convertTextToQuestionArray } = require('../utilities/convTextToQuesArray');
const { createPrompt } = require('../utilities/promptHelper');
const JobPostings = require('../models/jobPostings');
const transporter = require('../../configurations/gmailConfig');

async function customerSignup(data) {
    try {
        const { name, email, password, contact_no, method } = data;
        const isCustomerInDb = await checkCustomerInDb(email, method);
        if (isCustomerInDb === true) {
            return `User with these credentials already exists`;
        } else {
            try {
                const hashedPassword = await encryptPasword(password);
                const newData = {
                    name,
                    email,
                    password: hashedPassword,
                    contact_no,
                }
                const result = await Customer.create(newData);
                jwtSignature(result?.dataValues);
                return "User has been created successfully."
            } catch (err) {
                console.log("ERROR WHILE CREATING CUSTOMER:", err, '\n error source :  error source: src -> services -> primaryServices -> signup');
                return 'ERROR WHILE CREATING CUSTOMER:', err;
            }
        }
    } catch (err) {
        console.log('some error occured while signing up:', err, '\n error source: src -> services -> primaryServices -> signup');
        return "Some error occured while signing up";
    }
}


async function clientSignup(data) {
    try {
        const { name, client_location, email, password, contact_no, method } = data;
        const isClientInDb = await checkClientInDb(email, method);
        if (isClientInDb === true) {
            return `Client with these credentials already exists`;
        } else {
            try {
                const hashedPassword = await encryptPasword(password);
                const newData = {
                    name,
                    client_location,
                    email,
                    password: hashedPassword,
                    contact_no,
                }
                const result = await Client.create(newData);
                jwtSignature(result?.dataValues);
                return "CLIENT has been created successfully."
            } catch (err) {
                console.log("ERROR WHILE CREATING CLIENT:", err, '\n error source :  error source: src -> services -> primaryServices -> signup');
                return 'ERROR WHILE CREATING CLIENT:', err;
            }
        }
    } catch (err) {
        console.log('some error occured while signing up:', err, '\n error source: src -> services -> primaryServices -> signup');
        return "Some error occured while signing up";
    }
}

async function adminSignup(data) {
    try {
        const { email, password, method } = data;
        const isAdminInDb = await checkAdminInDb(email, method);
        if (isAdminInDb === true) {
            return `Admin with these credentials already exists`;
        } else {
            try {
                const hashedPassword = await encryptPasword(password);
                const newData = {
                    email,
                    password: hashedPassword,
                }
                const result = await Admin.create(newData);
                jwtSignature(result?.dataValues);
                return "Admin has been created successfully."
            } catch (err) {
                console.log("ERROR WHILE CREATING ADMIN:", err, '\n error source :  error source: src -> services -> primaryServices -> signup');
                return 'ERROR WHILE CREATING ADMIN:', err;
            }
        }
    } catch (e) {
        console.log("SOME ERROR OCCURED:", e, "\n Error source: src -> services -> primaryServices -> login ");
        return "SOME ERROR OCCURED:", e
    }
}


async function customerLogin(data) {
    try {
        const { email, password, method } = data;
        const fetchedCustomer = await checkCustomerInDb(email, method);
        if (fetchedCustomer) {
            try {
                const compareAndCheck = await comparePassword(password, fetchedCustomer?.password);
                if (!compareAndCheck) {
                    return "Invalid password";
                } else {
                    const token = await jwtSignature(fetchedCustomer.dataValues); // Pass customer_id and email
                    return token;
                }
            }
            catch (err) {
                console.log("ERR:", err, "\n Error source: src -> services -> primaryServices -> login");
                return "ERROR WHILE LOGGING IN:", err
            }
        }
        else {
            return "Customer not found";
        }
    } catch (err) {
        console.log("SOME ERROR OCCURED:", err, "\n Error source: src -> services -> primaryServices -> login ");
        return "SOME ERROR OCCURED:", err
    }
}

async function clientLogin(data) {
    try {
        const { email, password, method } = data;
        const fetchedClient = await checkClientInDb(email, method);
        if (fetchedClient) {
            try {
                const compareAndCheck = await comparePassword(password, fetchedClient?.password);
                if (!compareAndCheck) {
                    return "Invalid password";
                } else {
                    const token = await jwtSignature(fetchedClient?.dataValues);
                    return token;
                }
            }
            catch (err) {
                console.log("ERR:", err, "\n Error source: src -> services -> primaryServices -> login");
                return "ERROR WHILE LOGGING IN:", err
            }
        }
        else {
            return "Customer not found";
        }
    } catch (err) {
        console.log("SOME ERROR OCCURED:", err, "\n Error source: src -> services -> primaryServices -> login ");
        return "SOME ERROR OCCURED:", err
    }
}

async function adminLogin(data) {
    try {
        const { email, password, method } = data;
        const fetchedAdmin = await checkAdminInDb(email, method);
        if (fetchedAdmin) {
            try {
                const compareAndCheck = await comparePassword(password, fetchedAdmin?.password);
                if (!compareAndCheck) {
                    return "Invalid password";
                } else {
                    const token = await jwtSignature(fetchedAdmin?.dataValues);
                    return token;
                }
            }
            catch (err) {
                console.log("ERR:", err, "\n Error source: src -> services -> primaryServices -> login");
                return "ERROR WHILE LOGGING IN:", err
            }
        }
        else {
            return "Admin not found";
        }
    } catch (err) {
        console.log("SOME ERROR OCCURED:", err, "\n Error source: src -> services -> primaryServices -> login ");
        return "SOME ERROR OCCURED:", err
    }
}

async function getRandomQuestionsService(data) {
    const { expertise, difficulty, limit, position_id } = data;
    const prompt = createPrompt(expertise, difficulty, limit);
    try {
        const completion = await getCompletion(prompt);
        console.log("completion: ", completion.choices[0].message);
        const data = completion.choices[0].message.content;
        const finalData = convertTextToQuestionArray(data);

        const reqBody = {
            expertise,
            position_id,
            question: finalData,
        };
        console.log("request body:", reqBody);
        try {
            const submitQuestions = await Questions.create({
                question: finalData,
                position_id: position_id,
            });
            console.log("\nQUESTIONS SAVED IN DB:", submitQuestions);
            return { status: 200, message: submitQuestions };
        } catch (err) {
            console.log("ERROR WHILE SUBMITTING TO DB:", err, '\n ');
            return {
                status: 500,
                message: "Failed to update questions in the db table.",
            };
        }
    } catch (err) {
        console.error("OpenAI Error:", err.message,'\nError source: src -> services -> primaryServices -> getRandomQuestionsService');
        throw new Error("Failed to generate question");
    }
}

async function sendMailService(mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return error;
        } else {
            console.log("Email sent:", info.response);
            return;
        }
    });
}

async function createPositionsService(data) {

    const {
        position,
        client_id,
        expertise,
        job_type,
        description,
        status,
        applied_customers_count,
        location,
        is_test_required,
    } = data;

    try {
        const check = await Client.findOne({
            where: {
                client_id: client_id,
            },
        });

        if (check) {
            const requestBody = {
                position,
                client_id,
                expertise,
                job_type,
                description,
                status,
                applied_customers_count,
                location,
                is_test_required,
            };
            console.log("request body: ", requestBody);
            try {
                const result = await JobPostings.create(requestBody);
                return { statusCode: 200, data: result?.dataValues };
            } catch(e){
                console.log("Failed to create a job posting",e,'\nError source: src -> services -> primaryServices -> createPositionsService');
                return "Failed to create a job posting",e;
            }
        } else {
            return { statusCode: 404, message: "Unauthorized access to make a job posting." };
        }
    } catch (error) {
        console.log(error);
        return "Failed to create a job posting";
    }
}

module.exports = {
    customerSignup,
    clientSignup,
    customerLogin,
    clientLogin,
    adminSignup,
    adminLogin,
    getRandomQuestionsService,
    createPositionsService,
    sendMailService
} 
