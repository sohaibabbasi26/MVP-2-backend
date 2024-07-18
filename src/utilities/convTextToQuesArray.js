function convertTextToQuestionArray(text) {
    const questions = text
        .split(/\n\d+\.\s/)
        .filter((question) => question.trim() !== "");
    return questions.map((question, index) => ({
        question_id: index + 1,
        question: question.trim(),
    }));
}

module.exports = {
    convertTextToQuestionArray
}