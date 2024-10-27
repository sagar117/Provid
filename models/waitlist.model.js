const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // To parse incoming JSON requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/waitlistDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Create a Mongoose Schema for the waitlist
const waitlistSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    designation: String,
    helpArea: String,
    date: { type: Date, default: Date.now }
});


// API endpoint to handle waitlist form submission
app.post('/api/waitlist', async (req, res) => {
    const { firstName, lastName, companyName, email, designation, helpArea } = req.body;

    try {
        // Create a new entry in the waitlist
        const newEntry = new Waitlist({
            firstName,
            lastName,
            companyName,
            email,
            designation,
            helpArea
        });

        // Save the entry to the database
        await newEntry.save();

        // Respond with success
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});


const Waitlist = mongoose.model('Waitlist', waitlistSchema);

module.exports = Waitlist;

