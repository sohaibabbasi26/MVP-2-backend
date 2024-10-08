const calculateDays = (date) => {
    const pastDate = new Date(date);
    const currentDate = Date.now();

    // Calculate the difference in milliseconds
    const timeDifference = currentDate - pastDate.getTime();

    // Convert the difference from milliseconds to days
    const daysPassed = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // use math.floor for day not passing 24hr
    console.log(daysPassed + " days have passed.");

    return daysPassed;
}

module.exports={calculateDays}