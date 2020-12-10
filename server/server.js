const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const PORT = '3000';
const { router } = require('./routes/router.js');
const { db } = require('./db/db.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


app.use('/qa', router);

app.listen(3000, () => {console.log("Listening on port:", PORT)});
