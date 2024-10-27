const Waitlist = require('../models/waitlist.model'); // Import the User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Organization = require('../models/organization.model');
const https = require("https");
const fs = require('fs');
const util = require('util');
require('dotenv').config();

exports.addtowaitlist = async (req, res) => {
    const { firstName, lastName, companyName, email, designation, helpArea} = req.body;

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
        console.log(newEntry);
        await newEntry.save();

        // Respond with success
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
};