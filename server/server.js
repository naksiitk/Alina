require('dotenv').config()

const cors = require('cors');
const bodyParser = require('body-parser');

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

const usersRouter = require('./routes/users.js')
app.use('/user', usersRouter)

const docsRouter = require('./routes/docs.js')
app.use('/doc', docsRouter)

const credentialsRouter = require('./routes/credentials.js')
app.use('/credential', credentialsRouter)

app.listen(8000, () => console.log('Server Started'))

// 404 Handler
app.use((req, res, next) => {
    next(createError(404));
});

// Base Route
app.get('/', (req, res) => {
    res.send('invaild endpoint');
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
