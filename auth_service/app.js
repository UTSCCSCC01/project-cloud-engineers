const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const firebase = require("firebase");
const { nanoid } = require('nanoid');
require("firebase/firestore");

// initialize firebase access
firebase.initializeApp({
    apiKey: "AIzaSyCtx7BlaJUKKeqo2F1_IkKRQRd2L4Jvz3c",
    authDomain: "c01-project-8d228.firebaseapp.com",
    projectId: "c01-project-8d228",
    storageBucket: "c01-project-8d228.appspot.com",
    messagingSenderId: "897445501911",
    appId: "1:897445501911:web:b543b8b7484d2000ea0992",
    measurementId: "G-TDZ7VP3BKY"
})
var db = firebase.firestore();

// create the express app and configure all the middle ware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

SALT_ROUNDS = 5;

app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);

    // res.header('Access-Control-Allow-Headers', '*');
    // res.header('Access-Control-Allow-Origin', '*');
    next();
});


// ###########################################################################
// ---------------------------------------------------------------------------
// ##################### APPLICATION ROUTES AND LOGIC ########################
// ---------------------------------------------------------------------------
// ###########################################################################

app.post('/register', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        querySnapShot = await db.collection('users').where('email', '==', email).get();
        // check if the result is non-empty email already taken
        if (querySnapShot.docs.length !== 0) {
            console.log("NOT added")
            res.status(400);
            res.end();
            //json({: user_insert.insertedCount});
        } else {
            let uid = nanoid();
            db.collection('users').doc(uid).set({
                uid,
                username,
                email, 
                password: bcrypt.hashSync(password, SALT_ROUNDS),
                createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            }).then((docRef) => {
                console.log("added")
                res.json({status: 'success'})
            })
            .catch((error) => {
                res.status(400);
                res.end();
            });
        }
    } catch (err) {

    }
});

app.post('/login', async (req, res) => {
});

app.post('/logout', async (req, res) => {
});

app.post('/verify', async (req, res) => {
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));