const testService = require("../services/testService");
const fs= require('fs')
const path= require('path')

async function getRandomQuestions(req, res) {
  const { expertise, difficulty, position_id, question, customer_id } =
    req.body;
  const limit = 5;
  const result = await testService.getRandomQuestions(
    expertise,
    limit,
    customer_id
    //position_id,
    //question
  );
  res.status(result.status).send({ ...result });
}

async function getCandidateTestQuestion(req, res) {
  const { candidate_id } = req.query;
  const result = await testService.getCandidateTestQuestionService(
    candidate_id
  );

  res.status(result.status).send({ ...result });
}

async function takeTest(req, res) {
  const { question_answer, candidate_id } = req.body;
  const sent = await testService.takeTest({
    question_answer,
    candidate_id
  });
  res.status(sent.status).send({...sent});
}

async function SpeechToTextGeneration(req, res) {
    try {
        const { audio } = req.body;
        const audioFilename = path.join(
            process.env.FILE_PATH,
            "output.mp3"
        );
        console.log(
            `Current working directory in handler: ${process.cwd()}`
        );
        const audioBuffer = Buffer.from(audio, "base64");
        await fs.promises.writeFile(audioFilename, audioBuffer);
        const transcriptionResult =
            await testService.speechToTextGeneration(audioFilename);
        console.log("Audio transcription: ", transcriptionResult);
        await fs.promises.unlink(audioFilename);
        res.send({ transcriptionResult });
    } catch (err) {
        console.error("Error in SpeechToTextGeneration handler:", err);
        res.status(500).send("Internal server error");
    }
}

const getCodingQuestionHandler= (req,res)=>{
  const {candidate_id}= req.query;
  const result= testService.getCodingQuestionService(candidate_id);
  res.send(result)
}

module.exports = {
  getRandomQuestions,
  getCandidateTestQuestion,
  takeTest,
  SpeechToTextGeneration,
  getCodingQuestionHandler
};
