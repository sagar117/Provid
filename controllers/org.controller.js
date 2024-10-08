const Org = require('../models/organization.model'); // Import the Organization model
const User = require('../models/user.model'); // Import the User model
const Guide = require('../models/Guides'); // Import the User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Organization = require('../models/organization.model');
const https = require("https");
const fs = require('fs');
const util = require('util');
require('dotenv').config();
// const apiKey = process.env.apiKey;
const OpenAI = require("openai");


// Create an organization and a user simultaneously
exports.createOrgAndUser = async (req, res) => {
    const { orgName, orgEmail, username, password, userEmail } = req.body;

    try {
        // 1. Create the Organization
        const org = new Org({
            name: orgName,
            email: orgEmail
        });

        const savedOrg = await org.save();

        // 2. Create the User linked to the Organization
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the user's password
        const user = new User({
            username: username,
            email: userEmail,
            password: hashedPassword,
            org_id: savedOrg._id // Link user to the newly created organization
        });

        const savedUser = await user.save();

        // 3. Generate a JWT token for the user (optional)
        const token = jwt.sign({ userId: savedUser._id, orgId: savedOrg._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // 4. Send response back
        res.status(201).json({
            message: 'Organization and User created successfully',
            org: savedOrg,
            user: savedUser,
            token: token
        });
    } catch (error) {
        console.error('Error creating organization and user:', error);
        res.status(500).json({
            message: 'Server error. Unable to create organization and user.',
            error: error.message
        });
    }
};


// Save guide data for a specific organization
exports.saveGuide = async (req, res) => {
    const { title, description, events, orgId } = req.body;

    try {
        const newGuide = new Guide({
            title,
            description,
            events,
            organization: orgId, // Store the reference to the organization
            createdAt: new Date(),
        });

        await newGuide.save();
        res.status(201).json({ message: 'Guide saved successfully!', guide: newGuide });
    } catch (error) {
        console.error("Error saving guide:", error);
        res.status(500).json({ message: 'Failed to save guide.' });
    }
};

// Function to fetch all guides without filtering by orgId
exports.getGuides = async (req, res) => {
    try {
        // Fetch all guides from the database
        const guides = await Guide.find();

        // Send the guides back to the client
        res.status(200).json(guides);
    } catch (error) {
        console.error("Error fetching guides:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getorgguides =async (req,res) => {
    const { organization } = req.params;
    console.log(organization);

    try {
        const org_guide = await Guide.find({ organization });
        if (!org_guide) {
            return res.status(404).json({ message: 'No guide present for this org' });
        }
        res.status(200).json(org_guide);
    } catch (error) {
        console.error('Error fetching guides:', error);
        res.status(500).json({ message: 'Error fetching guides', error });
    }
};

exports.getOrgdetails =async(req,res) => {
    const {name} =req.params;
    console.log(name);
    try{
        const organization = await Org.findOne({name});
        if (!organization){
            return res.status(404).json({ message: 'No Org Found' });
        }
        res.status(200).json(organization);
        console.log(organization.id);
        

    }catch (error) {
        console.error('Error fetching organization:', error);
        res.status(500).json({ message: 'Error fetching organization', error });

    }
};

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  // Load API key from environment variables
});

exports.openairesponse = async (req, res) => {
    const { prompt } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",  // Specify the model
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
        });

        // Extract and send the message content
        const message = completion.choices[0].message.content;
        res.status(200).json({ message });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({ error: "Failed to fetch response from OpenAI API" });
    }
};



