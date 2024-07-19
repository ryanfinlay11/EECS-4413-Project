const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const app = express();

const { getAllProducts } = require('./logic/products');

const { login, register, updateAccount } = require('./logic/users');

app.use(express.json());

app.post('/api/getAllProducts', async (req, res) => {
    try {
        const response = await getAllProducts();
        res.json(response);
    }
    catch (error) {
        console.error(`Error getting products: ${error}`);
        res.status(500).json({ error: 'Error getting products' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const response = await login(req.body.username, req.body.password);
        res.json(response);
    }
    catch (error) {
        console.error(`Server error logging in: ${error}`);
        res.status(500).json({ error: 'Server error logging in' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const response = await register(req.body.username, req.body.password, req.body.creditCard, req.body.address);
        res.json(response);
    }
    catch (error) {
        console.error(`Server error registering: ${error}`);
        res.status(500).json({ error: 'Server error registering' });
    }
});

app.post('/api/updateAccount', async (req, res) => {
    try {
        const response = await updateAccount(req.body.userID, req.body.oldUsername, 
        req.body.newUsername, req.body.newPassword, req.body.newCreditCard, req.body.newAddress);

        res.json(response);
    }
    catch (error) {
        console.error(`Server error registering: ${error}`);
        res.status(500).json({ error: 'Server error registering' });
    }
});

app.all('*', (req, res) => {
    res.status(404).json({ error: 'API Call Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({ error: 'Internal Server Error' });
});

exports.api = functions.https.onRequest(app);
