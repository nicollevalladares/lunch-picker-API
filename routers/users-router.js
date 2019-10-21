var express = require('express')
var router = express.Router()
var admin = require('firebase-admin')
const FirebaseAuth = require('firebaseauth')

//Web API key
const api = new FirebaseAuth('AIzaSyCaYa2zEjUeXAopgDYqBePEnh3jR2Ti-hc')

//GET all users 
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

