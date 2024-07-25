const { getCompletion } = require('../utilities/OpenAIgateways');

async function generateCodeQues(prompt) {
    try {
        const completion = await getCompletion(prompt);
        console.log("COMPLETION:", completion.choices[0].message);
        const data = completion.choices[0].message.content;

        let JsonifiedData;
        try {
            JsonifiedData = await JSON.parse(data);
        } catch (parseError) {
            console.error(
                "Error parsing JSON:",
                parseError,
                "Raw data:",
                data
            );
        };
        console.log("jsonified data:", JsonifiedData);
        return JsonifiedData;
    } catch(err){
        console.log("Error in generating code question:",err,"/nError source: src -> utilities -> generateCodeQues");
        return "Error in generating code question:",err
    }
}

module.exports = {
    generateCodeQues
}