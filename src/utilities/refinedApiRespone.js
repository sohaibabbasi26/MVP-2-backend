async function refineApiResponse(response) {
    const jsonObjectPattern = /{[\s\S]*?}/;
    const match = response?.match(jsonObjectPattern);

    if (!match) {
        console.error("No JSON object found in the response.");
        return null;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(match[0]);
    } catch (err) {
        console.log("Error parsing JSON data:", err);
        return null;
    }

    const refinedObject = {
        technicalRating: 0,
        technicalAssessment: "Some sort of maliciousness from the user side caused the issue, which ultimately didn't let the report to generate correctly",
        softskillRating: 0,
        softskillAssessment: "Some sort of maliciousness from the user side caused the issue, which ultimately didn't let the report to generate correctly",
    };

    if (typeof parsedData === "object") {
        refinedObject.technicalRating =
            parsedData?.technicalRating || refinedObject?.technicalRating;
        refinedObject.technicalAssessment =
            parsedData?.technicalAssessment ||
            refinedObject?.technicalAssessment;
        refinedObject.softskillRating =
            parsedData?.softskillRating || refinedObject?.softskillRating;
        refinedObject.softskillAssessment =
            parsedData?.softskillAssessment ||
            refinedObject?.softskillAssessment;
    }
    // if(refinedObject !== null){
    return refinedObject;
    // } else {
    //     const refinedObject = {
    //         technicalRating: 0,
    //         technicalAssessment: "Some sort of maliciousness from the user side caused the issue, which ultimately didn't let the report to generate correctly",
    //         softskillRating: 0,
    //         softskillAssessment: "Some sort of maliciousness from the user side caused the issue, which ultimately didn't let the report to generate correctly",
    //     };
    //     return refinedObject;
    // }
}

module.exports = {
    refineApiResponse
}