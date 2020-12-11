const express = require('express');
const router = express.Router();
const { findQuestion, findAnswers, reportQuestion, reportAnswer, markQuestionHelpful, markAnswerHelpful, addQuestion, addAnswer } = require('./../db/controllers.js');
const { redisClient, getPromise } = require('./../db/db.js');

// Cache middleware: Is there a better way to organize this in code?
function cache(req, res, next) {
  const { product_id } = req.query;
  console.log('Checking cache!')
  getPromise(product_id)
  .then((results) => {
    if (results != null) {
      res.json(JSON.parse(results));
    } else {
      next();
    }
  })
  .catch((err) => {
    console.log('Error in middleware cache!! Error: ', err);
  })
};


router.get('/questions', cache, (req, res) => {

  findQuestion(req, res)
  .then((results) => {

    const resultsObj = {product_id: req.query.product_id, results: results}
    // Save to redis database on return. Will stringify cause issues?
    redisClient.set(req.query.product_id, JSON.stringify(resultsObj));
    res.json(resultsObj);
  })
  .catch((err) => {
    console.log("Error from request! Error: ", err);
    res.sendStatus(500);
  })
})

router.get('/questions/:question_id/answers', (req, res) => {
  findAnswers(req, res)
  .then((results) => {
    const resultsObj = {question: req.params.question_id, page: req.query.page, count: req.query.count, results: results[0].answers}
    res.json(resultsObj);
  })
  .catch((err) => {
    console.log("Error from answers route!! Error: ", err);
    res.sendStatus(500)
  })
})

router.put('/questions/:question_id/report', (req, res) => {
  reportQuestion(req, res)
  .then((results) => {
    console.log(results);
    res.send('NO CONTENT').status(204);
  })
  .catch((err) => {
    console.log("Error from question report route!! Error: ", err);
    res.sendStatus(500);
  })
})

router.put('/answers/:answer_id/report', (req, res) => {
  reportAnswer(req, res)
  .then((results) => {
    res.send('NO CONTENT').status(204);
  })
  .catch((err) => {
    console.log("Error from answer report route!! Error: ", err);
    res.sendStatus(500);
  })
})

router.put('/questions/:question_id/helpful', (req, res) => {
  markQuestionHelpful(req, res)
  .then((results) => {
    res.send('NO CONTENT').status(204);
  })
  .catch((err) => {
    res.sendStatus(500);
  })
})

router.put('/answers/:answer_id/helpful', (req, res) => {
  markAnswerHelpful(req, res)
  .then((result) => {
    res.send('NO CONTENT').status(204);
  })
  .catch((err) => {
    res.sendStatus(500);
  })
})

router.post('/questions', (req, res) => {
  addQuestion(req, res)
  .then((result) => {
    res.send('Created!').status(201)
  })
  .catch((err) => {
    console.log("Error in questions post! Error: ", err)
    res.sendStatus(500);
  })
})

router.post('/questions/:question_id/answers', (req, res) => {
  addAnswer(req, res)
  .then((result) => {
    res.send('Created!').status(201)
  })
  .catch((err) => {
    console.log("Error in answers post! Error: ", err)
    res.sendStatus(500);
  })
})

exports.router = router;