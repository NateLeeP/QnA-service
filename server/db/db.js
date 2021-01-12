const mongoose = require('mongoose');
const { username, password, dbURL } = require('./../../db_config.js');
const connectionURL = `mongodb://${username}:${password}@${dbURL}/QnA`;
/*
Connect to redis
*/
const redis = require('redis');
const redisClient = redis.createClient({"host": "localhost", "port": 6379}); // I had 'some-redis' as host before changing it... Did this have something to do with docker?

const { promisify } = require("util");
const getPromise = promisify(redisClient.get).bind(redisClient);

//mongoose.connect('mongodb://localhost/QnA');

mongoose.connect(connectionURL);

const db = mongoose.connection;

db.on('error', () => {console.log('Error! Connection error')});
db.once('open', () => {
  console.log('Successfully connected to database');
})



redisClient.on("connect", (connect) => {
  console.log('connect!!');
});

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
exports.redisClient = redisClient;
exports.getPromise = getPromise;