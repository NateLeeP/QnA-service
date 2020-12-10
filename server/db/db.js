const mongoose = require('mongoose');
const { username, password, dbURL } = require('./../../db_config.js');
const connectionURL = `mongodb://${username}:${password}@${dbURL}/QnA`;

//mongoose.connect('mongodb://localhost/SDC_Test');

mongoose.connect(connectionURL);

const db = mongoose.connection;

db.on('error', () => {console.log('Error! Connection error')});
db.once('open', () => {
  console.log('Successfully connected to database');
})

const answerSchema = new mongoose.Schema({
  answer_id: Number,
  question_id: Number,
  body: String,
  date_written: String,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpful: Number,
  photos: [String]
})

const sequenceSchema = new mongoose.Schema({
  _id: String,
  seqCount: Number
})

const questionSchema = new mongoose.Schema({
    question_id: Number,
    product_id: Number,
    body: String,
    date_written: String,
    asker_name: String,
    asker_email: String,
    reported: Boolean,
    helpful: Number,
    answers: [answerSchema]
})

const Question = mongoose.model('Question', questionSchema);
const Sequence = mongoose.model('Sequence', sequenceSchema);

exports.db = db;
exports.Question = Question;
exports.Sequence = Sequence;
