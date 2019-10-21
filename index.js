var express = require("express")
var cors = require('cors')
const app = express()
var admin = require("firebase-admin")
var bodyParser = require("body-parser")
var serviceAccount = require("./serviceAccountKey.json")
const path = require('path')
const cookieParser = require('cookie-parser')

var usersRouter = require('./routers/users-router')

var formidable = require('express-form-data')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lunch-picker-b59bd.firebaseio.com"
})

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(formidable.parse({keepExtensions:true}))
app.use(express.static(path.join(__dirname, 'public')))

app.use("/users",usersRouter)

app.listen('3333', function () {
    console.log('Server successfully running at 3333 port',);
})