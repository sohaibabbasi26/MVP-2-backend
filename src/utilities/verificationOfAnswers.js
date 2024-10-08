const {createVerificationPrompt} = require('../utilities/promptHelper');
const {getVerifiedCompletion} = require('../utilities/OpenAIgateways');

async function verificationOfAnswers(dataArray) {
    try {
        console.log("in verificationOfAnswers");

        const prompt = createVerificationPrompt();
        let array = [];
        for (QA of dataArray) {
            console.log(
                ">>>>>>> THE FLOW OF PROGRAM IS IN  < 5 CONDITION and the answer has a length of:",
                countWords(QA?.answer)
            );
            if (countWords(QA.answer) <= 5) {
                const data = {
                    technicalRating: 0,
                    technicalAssessment:
                        "The canidatate hasn't replied with adequate amount of information for the required topic.",
                    softskillRating: 0,
                    softskillAssessment:
                        "Could not assess candidate's emotional intelligence as he/she didn't provide much of an information",
                };
                const entry = {
                    question: QA.question,
                    answer: QA.answer,
                    technicalScore: data.technicalRating,
                    softSkillScore: data.softskillRating,
                    technicalAssessment: data.technicalAssessment,
                    softSkillAssessment: data.softskillAssessment,
                };
                array.push(entry);
            } else if (
                countWords(QA.answer) > 5 &&
                countWords(QA.answer) <= 10
            ) {
                console.log(
                    ">>>>>>> THE FLOW OF PROGRAM IS IN  > 5 and < 10 CONDITION and the answer has a length of:",
                    countWords(QA?.answer)
                );
                const data = {
                    technicalRating: 0,
                    technicalAssessment:
                        "The canidatate hasn't replied with adequate amount of information for the required topic.",
                    softskillRating: 0,
                    softskillRating:
                        "Could not assess candidate's emotional intelligence as he/she didn't provide much of an information",
                };
                const entry = {
                    question: QA.question,
                    answer: QA.answer,
                    technicalScore: data.technicalRating,
                    softSkillScore: data.softskillRating,
                    technicalAssessment: data.technicalAssessment,
                    softSkillAssessment: data.softskillAssessment,
                };
                array.push(entry);
            } else {
                console.log(
                    ">>>>>>> THE FLOW OF PROGRAM IS IN  else (Open AI) CONDITION and the answer has a length of:",
                    countWords(QA?.answer)
                );

                const completion = await getVerifiedCompletion(
                    prompt,
                    QA.question,
                    QA.answer
                );
                const data = completion.choices[0].message.content.trim();
                console.log("Raw data:", data);
                let JsonifiedData;
                try {
                    JsonifiedData = JSON.parse(data);
                } catch (parseError) {
                    console.error(
                        "Error parsing JSON:",
                        parseError,
                        "Raw data:",
                        data
                    );
                    continue;
                }
                console.log("completion: ", JsonifiedData);
                const entry = {
                    question: QA.question,
                    answer: QA.answer,
                    technicalScore: JsonifiedData.technicalRating,
                    softSkillScore: JsonifiedData.softskillRating,
                    technicalAssessment: JsonifiedData.technicalAssessment,
                    softSkillAssessment: JsonifiedData.softskillAssessment,
                };
                array.push(entry);
            }
        }
        console.log("new array:", array);
        return array;
    } catch (err) {
        console.log("Error in getting completion in compilation: ", err);
    }
}

function countWords(str) {
    // Check if str is a valid string, otherwise return 0
    if (typeof str !== 'string') {
        return 0;
    }
    const words = str.trim().split(/\s+/);
    return words.length;
}


module.exports = {
    verificationOfAnswers
}