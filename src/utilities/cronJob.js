const {verificationOfAnswers} = require('./verificationOfAnswers')
const {getReportCompletion} = require('./OpenAIgateways');
const {resultGenerationPrompt} = require('./promptHelper');
const {refineApiResponse} = require('./refinedApiRespone');
const JobPostings = require('../models/jobPostings');
const Results = require('../models/results');


async function processJob(job, job_posting_id, resultQueue) {
    const { question_answer, customer_id, testId } = job;
    console.log("job:", job);
    try {
        const assessment = await verificationOfAnswers(question_answer, resultQueue);
        const prompt = await resultGenerationPrompt();
        if (assessment) {
            const OpenAIresponse = await getReportCompletion(
                assessment,
                prompt
            );
            if (
                !OpenAIresponse ||
                !OpenAIresponse.choices ||
                !OpenAIresponse.choices.length ||
                !OpenAIresponse.choices[0].message
            ) {
                throw new Error("Invalid OpenAI response structure");
            }
            const data = OpenAIresponse.choices[0].message.content.trim();
            const refinedObject = await refineApiResponse(data);
            console.log("refined object:", refinedObject);
            const res = await Results.create({
                result: refinedObject,
                test_id: testId,
                customer_id: customer_id,
            });

            return refinedObject;
        }
    } catch (err) {
        console.error("Failed processing job:", err);
    }
}
setInterval(() => {
}, 20000);


module.exports = {
    processJob
}