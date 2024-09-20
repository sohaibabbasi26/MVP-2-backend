function createPrompt(expertise) {
    if (!Array.isArray(expertise)) {
        expertise = [expertise];
    }
    console.log("length of expertise:", expertise.length);
    const totalNoOftheoryQuestions = expertise.length * 2;
    const expertiseList = expertise
        .map(
            (e) =>
                `${e.skill.toLowerCase()} difficulty: ${e.level.toLowerCase()}`
        )
        .join(", ");
    console.log("expertise list:", expertiseList);
    return `
    Expertise List: ${expertiseList}
    - GENERATE PER EXPERTISE ONLY 2 QUESTIONS according to their difficulty level specified, AND ADD 2 soft skills questions at the end.
    - Each topic must have the difficulty level of questions as per specified
    - Don't add ANY SORT OF HEADING BEFORE AND AFTER.
    don't mention any heading or something like that, i just need questions
    do not generate any extra text.
    do not combine them in one paragraph at all.
    
`;
}

// do not mark questions with numeric prefixes, but they'all should be in an array-like structure

// also add 2 soft skill assessment question at the end of these questions at last place.

function translationPrompt(text) {
    return `
    Translate the following text to English, ensuring accuracy in meaning: ${text}, Do not add the extra text in the empty voices, just transcribe what is said in the mic.
    `;
}

function createVerificationPrompt() {
    console.log("in createVerificationPrompt");

    return `
    - The output should be a JSON object with not even JSON written before it the following properties:

    verify the first 5 questions only.

    MUST CHECK THESE POINTS:
    - Verify the candidate responses according to the following criteria:
        * ALWAYS ASSIGN ZERO DIRECTLY to these cases:
            - I WANT YOU TO ASSIGN 0 RATING TO IRRELEVANT ANSWER LIKE "Thank You.", "All right.", "Out." "Bye", "bye.", "BYE", "bye bye", "Bye.", "thank you", "Thank you.", "Thanks", "now.", "Now.", "Transcription Failed", "Okay", "Okay.", "You", "oh" 
            - ASSIGN only 0 MARKS to RATINGS TO ALL THE ONE WORD to THREE WORD answers, NO MATTER what these words are!
            -  if the candidate provides an answer of "Thank you." or "Transcription Failed", directly assign 0 numbers in technical ratings to that candidate.
            -  if the candidate provides an answer of one to three words DIRECTLY ASSIGN 0 MARKS IN RATINGS AND MENTION INADEQUATE INFO IN SUMMARIES.
            - ASSIGN 0 MARKS TO RATING If the response contains any language other than English.
        * Detailed Evaluation for Other Responses:
            - Do not expect coding example, if the user tries to explain the things verbally correct give them good marks
            - Length and Detail: Longer, more detailed responses that demonstrate a thorough understanding should be scored accordingly.
            - Relevance: Assess how closely the response addresses the specific question asked and score them high ONLY IF THEY ARE RELEVANT TO THE QUESTION ASKED.
            - Accuracy: Evaluate the technical correctness and the factual accuracy of the response and score them accordingly
            only MARK HIGH RATINGS when the answer is close to correctness and facts
            .

    - The response from your side should be a JSON object without even an extra single character other than the object with the following properties:
        technicalRating: Rate the answer between 0 to 10 based on technical content and accuracy.
        technicalAssessment: Provide detailed justification for your technical rating.
        softskillRating: Rate communication style and other soft skills demonstrated in the text out of 10.
        softskillAssessment: Provide an explanation supporting your soft skill rating.

        NOTE AGAIN : I ONLY WANT A JSON OBJECT AND NOT EVEN JSON WRITTEN BEFORE IT
    `;
}

async function resultGenerationPrompt() {
    return `
    REQUIREMENTS:
    - only an object containing properties no extra text not even write json before it, just return the json object.
    - Not even write JSON before it.
    - If there are no proper info about questions and answers, atleast the object will always be created with the same properties with being assigned a 0 in all the ratings and also summary should also give insights about it, and if this is the case then don't write a single bit of extra character, just give the object. 
    

    Given the following list of candidate question and answers , return a JSON object containing these properties with not even a word of extra text or explanation:
    technicalRating: (calculate a mean of all the technical ratings in the above provided array from 0 to 10),
    technicalAssessment: (take all the technical assessments above and create a summarised and well-organised combined technical analysis),
    softskillRating:(calculate a mean of all the soft-skill ratings in the above provided array from 0 to 10),
    softskillAssessment: (take all the soft-skill assessments above and create a summarised and well-organised combined soft-skill analysis),

    NOTE AGAIN : I ONLY WANT A JSON OBJECT AND NOT EVEN JSON WRITTEN BEFORE IT.
    `;
}

async function CodingAssignmentPrompt() {
    return `
    REQUIREMENTS:
    - with not even a word of extra text or explanation not even right json before it, just return the json object
    - coding question should only ask to create logic, don't specify any language.  

    return a JSON object containing these properties with not even a word of extra text or explanation:
    codingQuestion: (a coding question tricky in accordance with the skill and its difficulty level),
    exampleInput: (give very basic example of input used by the coding question you provided in the codingQuestion property, or say "no input needed", if there is no need of an input),
    exampleOutput :(give very basic example of how output should be related to the coding question you provided in the codingQuestion property),
    constraints: (provide and array of constraints if needed or else say "no constraints"),
    `;
}

async function CodingExcersiceVerificationPrompt(
    code,
    question,
    constraints,
    output
) {
    return `
        REQUIREMENTS:
        - with not even a word of extra text or explanation.
        - NOT EVEN WRITE JSON before it, just return the json object
        - If the test is submitted with empty code input, straight away mark 0 and also tell this in the summary that candidate didn't even write code.

        This was the coding exercise question: ${question},
        Following is the code done by the candidate: ${code},
        Keeping in mind following these constraints: ${constraints},
        and the output we evaluated of this code : ${output}

        Take all of it as an input and provide me a JSON object containing these properties with not even a word of extra text or explanation:
        technicalSummary: (create a paragraph that is summarised and well-organised combined technical analysis based on the question, code and constraints above as an input for you);
        technicalRating: (take all the question, code and constraints above and create a summarised and accurate technical rating out of 10);
    `;
}

module.exports = {
    createPrompt,
    createVerificationPrompt,
    translationPrompt,
    resultGenerationPrompt,
    CodingAssignmentPrompt,
    CodingExcersiceVerificationPrompt,
};