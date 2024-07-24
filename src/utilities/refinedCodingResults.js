async function refineApiResponseForCoding(response) {
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
        technicalSummary: "some text",
    };

    if (typeof parsedData === "object") {
        refinedObject.technicalRating =
            parsedData?.technicalRating || refinedObject?.technicalRating;
        refinedObject.technicalSummary =
            parsedData?.technicalSummary || refinedObject?.technicalSummary;
    }

    return refinedObject;
}

module.exports = {
    refineApiResponseForCoding
}