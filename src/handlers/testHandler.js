const testService= require('../services/testService')

async function getRandomQuestions(req, res) {
    const { expertise, difficulty, position_id, question, customer_id } = req.body;
    const limit = 5;
    const result = await testService.getRandomQuestions(
        expertise,
        limit,
        customer_id
        //position_id,
        //question
    );
    res.status(result.status).send({...result});
}

module.exports={
    getRandomQuestions
}