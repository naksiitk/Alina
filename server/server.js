require('dotenv').config()

const express = require('express')
const app = express()

/////////////////////////////////////////////////////////////////////
/////// Connect to MongoDB database 
const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

/////////////////////////////////////////////////////////////////////
/////// app MiddleWares
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/////////////////////////////////////////////////////////////////////
/////// Use CORS only in dev, nginx takes care in prod
 const cors = require('cors');
 app.use(cors());

/////////////////////////////////////////////////////////////////////
/////Routes
const loginRouter = require('./routes/login.js')
app.use('/login', loginRouter)

const usersRouter = require('./routes/users.js')
app.use('/user', usersRouter)

const docsRouter = require('./routes/docs.js')
app.use('/doc', docsRouter)

const asked_filesRouter = require('./routes/asked_files.js')
app.use('/asked_files', asked_filesRouter)

const returnsRouter = require('./routes/returns.js')
app.use('/return', returnsRouter)

const credentialsRouter = require('./routes/credentials.js')
app.use('/credential', credentialsRouter)

const docs_uploadRouter = require('./routes/docs_upload.js')
app.use('/docs_upload', docs_uploadRouter)

/////////////////////////////////////////////////////////////////////
/////// JWT Checking Middlewares
const JWT = require('jsonwebtoken')

function OpenJWT(req, res, next) {
    const authHeader = req.headers['authorization']
    const Token = authHeader && authHeader.split(' ')[1]
    if(Token == null) return res.sendStatus(401)

    JWT.verify(Token, process.env.JWT_SECRET_KEY , (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

/////////////////////////////////////////////////////////////////////
/////// Start Listening 
app.listen(8000, () => console.log('Server Started'))

/////////////////////////////////////////////////////////////////////
/////// Error Handling MiddleWare

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
