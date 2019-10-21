var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
// const FirebaseAuth = require('firebaseauth')

//Web API key
// const api = new FirebaseAuth('AIzaSyCaYa2zEjUeXAopgDYqBePEnh3jR2Ti-hc')

//GET all users information (GET method)
router.get('/', validateUser, (req,res) => {
    var usersReference = admin.database().ref('users')

    try{
        usersReference.once('value')
        .then( (snapshot) => {
            const users = []

            snapshot.forEach(doc => {
                let user = doc.val()
                user.id = doc.key

                users.push(user)
            })

            res.status(200).json(users)
        },
        (err) => {
            res.status(400).send(err.code)
        })
    }
    catch (error) {
        res.status(400).send({message: 'Error: ' + error})
    }
})

// get a user information (GET method)
router.get('/:id', validateUser, (req, res) => {
    var usersReference = admin.database().ref('users')

    try {
        usersReference.orderByKey().equalTo(req.params.id)
        .on('child_added', (snapshotUser) => {
            res.status(200).json({data: snapshotUser.val()})
        },
        (err) => {
            res.status(400).send(err.code)
        })
    } catch (error) {
        res.status(400).send({message: 'Error: ' + error})
    }
})

//Save a new user (POST method)
router.post('/', validateUser, (req, res) => {
    var usersReference = admin.database().ref('users')

    //data to save a user
    var data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }

    try {
        usersReference.push(data, (err) => {
            if(err){
                res.status(400).json({message: 'An erro has ocurred'})
            }
            else{
                res.status(200).json({message: 'User registered'})
            }
        })
    } catch (error) {
        res.status(400).json({message: 'Error: ' + error})
    }
})

//validate user logged with token.
function validateUser(req, res, next) {
    var idToken = req.headers.idToken

    try {
        if (idToken){
            admin.auth().verifyIdToken(idToken)
            .then((decodedIdToken) => {
                if(decodedIdToken){
                    req.uid = decodedIdToken.uid
                    return next()
                }
            })
        }
        else{
            res.status(401).json({code:401 ,message:"Access Unauthorized"})
        }
    } catch (error) {
        res.status(400).send({message:'Error' + error})
    }
}

module.exports = router
