//const dateString = '2024-10-10T19:00:00.000000Z';
const date = new Date(dateString);

// Function to format the date and time in AM/PM
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // Use 12-hour format
    };
    
    return date.toLocaleString('en-US', options); // Convert to a string based on locale
}

module.exports= {formatDate};

// const formattedDate = formatDate(date);
// console.log(formattedDate); // Example output: "October 10, 2024, 7:00 PM"