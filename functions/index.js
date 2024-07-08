const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

app.post('/api/hello', (req, res) => {
    res.send('Hello World!');
});

app.all('*', (req, res) => {
    res.status(404).json({ error: 'API Call Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({ error: 'Internal Server Error' });
});

exports.api = functions.https.onRequest(app);
