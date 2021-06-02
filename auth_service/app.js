const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// create the express app and configure all the middle ware
const app = express();

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
});

app.post('/login', async (req, res) => {
});

app.post('/logout', async (req, res) => {
});

app.post('/verify', async (req, res) => {
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));