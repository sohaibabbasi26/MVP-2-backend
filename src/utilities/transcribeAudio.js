const openai = require("../../configurations/openAiConfig");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// const configPath = path.join("C:/Users/user/recuitinn-product/events-app-backend", "output.mp3");

async function transcribeAudio(filename) {
    console.log(
        `Current working directory un transcribed audio: ${process.cwd()}`
    );

    // const configPath = path.join(
    //     "/home/ubuntu/events-app-backend",
    //     "output.mp3"
    // );

    const configPath = path.join(
        process.env.FILE_PATH,
        "output.mp3"
    );
    ///home/ubuntu/events-app-backend
    if (fs.existsSync(configPath)) {
        console.log("File exists:", configPath);
    } else {
        console.error("File does not exist:", configPath);
    }

    console.log("file name in trancribe function: ", filename);
    const audioFileStream = fs.createReadStream(configPath);
    const transcript = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFileStream,
    });
    return transcript;
}

module.exports = {transcribeAudio};
