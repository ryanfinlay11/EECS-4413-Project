const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
const app = express();

const { getAllProducts, editQuantity, addProduct } = require('./logic/products');

const { login, register, updateAccount, getAllUsers, updateAccountAttribute } = require('./logic/users');

const { createOrder, getAllOrders } = require('./logic/orders');

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

app.post('/api/checkout', async (req, res) => {
    try {
        const response = await createOrder(req.body);

        res.json(response);
    }
    catch (error) {
        console.error(`Server error checking out: ${error}`);
        res.status(500).json({ error: 'Server error checking out' });
    }
});

app.post('/api/getAllOrders', async (req, res) => {
    try {
        const response = await getAllOrders();

        res.json(response);
    }
    catch (error) {
        console.error(`Server error getting orders: ${error}`);
        res.status(500).json({ error: 'Server error getting orders' });
    }
});

app.post('/api/editQuantity', async (req, res) => {
    try {
        const response = await editQuantity(req.body);

        res.json(response);
    }
    catch (error) {
        console.error(`Server error editing quantity: ${error}`);
        res.status(500).json({ error: 'Server error editing quantity' });
    }
});

app.post('/api/addProduct', async (req, res) => {
    try {
        const response = await addProduct(req.body);

        res.json(response);
    }
    catch (error) {
        console.error(`Server error adding product: ${error}`);
        res.status(500).json({ error: 'Server error adding product' });
    }
});

app.post('/api/getAllUsers', async (req, res) => {
    try {
        const response = await getAllUsers();

        res.json(response);
    }
    catch (error) {
        console.error(`Server error adding product: ${error}`);
        res.status(500).json({ error: 'Server error adding product' });
    }
});

app.post('/api/updateAccountAttribute', async (req, res) => {
    try {
        const response = await updateAccountAttribute(req.body);

        res.json(response);
    }
    catch (error) {
        console.error(`Server error editing account attribute: ${error}`);
        res.status(500).json({ error: 'Server error editing account attribute' });
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
