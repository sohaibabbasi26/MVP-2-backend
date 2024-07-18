const apiClient = require('../../configurations/openAiConfig');

async function getCompletion(prompt) {
    console.log("api client: ", Object.keys(apiClient.chat));

    if (!prompt ) {
        throw new Error('All parameters (prompt, question, answer) must have valid values.');
    }

    const completion = await apiClient.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens: 250
    });
    return completion;
}

module.exports = {
    getCompletion
}