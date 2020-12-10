const { Question, Sequence } = require('./db.js');

const findQuestion = (req, res) => {
  const product_id = Number(req.query.product_id);
  const page = req.query.page === undefined ? 1 : req.query.page;
  const count = req.query.count === undefined ? 5 : req.query.count ;
  const skip = (page - 1) * count;
  return Question
  .where('product_id').equals(product_id)
  .where('reported').equals('false')
  .skip(skip)
  .limit(count)
  .select(['-_id', '-answers._id'])
  .lean()
  .exec()
}

const findAnswers = (req, res) => {
  const question_id = req.params.question_id;
  const product_id = req.query.product_id;
  const page = req.query.page === undefined ? 1 : req.query.page;
  const count = req.query.count === undefined ? 5 : req.query.count;
  const skip = (page - 1) * count;
  return Question
  .where('product_id').equals(product_id)
  .where('question_id').equals(question_id)
  .select(['answers'])
  .lean()
  .exec()
}

const reportQuestion = (req, res) => {
  const question_id = Number(req.params.question_id);
  const product_id = Number(req.query.product_id);
  return Question
  .findOneAndUpdate({product_id: product_id, question_id: question_id}, { $set : {reported: true}}, {new: true, useFindAndModify: false})
  .lean()
  .exec()
}

const reportAnswer = (req, res) => {
  const question_id = Number(req.query.question_id);
  const product_id = Number(req.query.product_id);
  const answer_id = Number(req.params.answer_id);
  return Question
  .findOneAndUpdate({product_id: product_id, question_id: question_id, "answers.answer_id": answer_id}, {$set : {"answers.$.reported": true}})
  .lean()
  .exec()
}

const markQuestionHelpful = (req, res) => {
  const question_id = Number(req.params.question_id);
  const product_id = Number(req.query.product_id);

  return Question
  .findOneAndUpdate({product_id: product_id, question_id:question_id}, { $inc : {helpful: 1}}, {new: true})
  .lean()
  .exec();
}

const markAnswerHelpful = (req, res) => {
  const question_id = Number(req.query.question_id);
  const product_id = Number(req.query.product_id);
  const answer_id = Number(req.params.answer_id);

  return Question
  .findOneAndUpdate({product_id, question_id, "answers.answer_id": answer_id}, {$inc: {"answers.$.helpful": 1}})
  .lean()
  .exec();
}


const retrieveCount = (category) => {
  return Sequence
  .findOneAndUpdate({_id: category}, {$inc: {seqCount: 1}}, {new: true})
  .lean()
  .exec()
}


const addQuestion = (req, res) => {
  return retrieveCount('question')
  .then((results) => {
    const product_id = Number(req.body.product_id);
    const body = req.body.body;
    const name = req.body.name;
    const email = req.body.email;
    const todayDate = new Date();
    const date = (todayDate.getMonth() + 1) + '/' + (todayDate.getDate()) + '/' + (todayDate.getFullYear());
    return {
      question_id: Number(results.seqCount),
      product_id: Number(req.body.product_id),
      body: req.body.body,
      date_written: date,
      asker_name: name,
      asker_email: email,
      reported: false,
      helpful: 0,
      answers: []
    }
  })
  .then((obj) => {
    return Question
    .create(obj)
  })
  .catch((err) => {
    return Sequence
    .findOneAndUpdate({_id: 'question'}, {$inc: {seqCount: -1}}, {new: true})
    .lean()
    .exec() // if error adding question, reduce seqcount back to previous amount
  })
}

const addAnswer = (req, res) => {
  return retrieveCount('answer')
  .then((results) => {
    const todayDate = new Date();
    const date = (todayDate.getMonth() + 1) + '/' + (todayDate.getDate()) + '/' + (todayDate.getFullYear());
    return {
      answer_id: results.seqCount,
      product_id: Number(req.body.product_id),
      question_id: Number(req.params.question_id),
      body: req.body.body,
      date_written: date,
      answerer_name: req.body.name,
      answerer_email: req.body.email,
      reported: false,
      helpful: 0,
      photos: []
    }
  })
  .then((obj) => {
    return Question
    .findOneAndUpdate({product_id: obj.product_id, question_id: obj.question_id}, {$push: {"answers": {"answer_id": obj.answer_id, "question_id": obj.question_id, "body": obj.body,
                                                                                                        "date_written": obj.date_written, "answerer_name": obj.answerer_name, "answerer_email": obj.answerer_email, "reported": obj.reported, "helpful": obj.helpful, "photos": obj.photos}}})
    .lean()
    .exec()
  })
  .catch((err) => {
    return Sequence
    .findOneAndUpdate({_id: 'answer'}, {$inc: {seqCount: -1}}, {new: true})
    .lean()
    .exec() // if error adding answer, reduce seqCount back to previous amount
  })
}
/*
retrieveCount('question')
.then((result) => {
  console.log(result.seqCount);
})
.catch((err) => {
  console.log("error with retreive count!");
})
*/
exports.findQuestion = findQuestion;
exports.findAnswers = findAnswers;
exports.reportQuestion = reportQuestion;
exports.reportAnswer = reportAnswer;
exports.markQuestionHelpful = markQuestionHelpful;
exports.markAnswerHelpful = markAnswerHelpful;
exports.addQuestion = addQuestion;
exports.addAnswer = addAnswer;