const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Endpoint to save phone numbers
app.post('/save-phone-number', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format.' });
    }
    fs.appendFile('phone_numbers.txt', `${phoneNumber}\n`, (err) => {
        if (err) {
            console.error('Error saving phone number:', err);
            return res.status(500).json({ message: 'Failed to save phone number' });
        }
        res.status(200).json({ message: 'Phone number saved successfully' });
    });
});

// Endpoint to retrieve phone numbers as JSON
app.get('/get-phone-numbers', (req, res) => {
    fs.readFile('phone_numbers.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading phone numbers:', err);
            return res.status(500).json({ message: 'Failed to read phone numbers' });
        }
        const phoneNumbers = data.split('\n').filter(Boolean);
        res.json({ phoneNumbers });
    });
});

// Endpoint to download phone numbers as CSV
app.get('/download-phone-numbers', (req, res) => {
    const filePath = path.join(__dirname, 'phone_numbers.txt');
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'No phone numbers found to download' });
    }
    res.setHeader('Content-Disposition', 'attachment; filename="phone_numbers.csv"');
    res.setHeader('Content-Type', 'text/csv');
    fs.createReadStream(filePath).pipe(res);
});

// Export the app for Vercel
module.exports = app;
