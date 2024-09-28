const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();

// Assuming you have a database model for Organization and User
const Organization = require('../models/organization.model'); // Your ORM model for Organization
const User = require('../models/user.model'); // Your ORM model for User

// Create Organization and User route
router.post('/create', async (req, res) => {
    const { orgName, orgEmail, user } = req.body;

    try {
        // Create organization
        const organization = await Organization.create({ name: orgName, email: orgEmail });

        // Hash the user password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Create user
        await User.create({
            username: user.username,
            password: hashedPassword,
            email: user.email,
            org_id: organization._id, // Link user to the organization
        });
        console.log(res);

        res.status(201).json({ message: 'Organization and User created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating organization or user.' });
    }
});

module.exports = router;

