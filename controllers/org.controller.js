const Org = require('../models/organization');  // Assuming you have an Org model
const User = require('../models/user');  // Assuming you have a User model
const jwt = require('jsonwebtoken');
require('dotenv').config();  // To use the JWT_SECRET from environment variables

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Create organization controller
const createOrg = async (req, res) => {
    try {
        // Get token from headers
        const token = req.header('Authorization')?.split(' ')[1];

        // If no token, return forbidden
        if (!token) {
            return res.status(403).json({ message: 'Forbidden: No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Extract organization details from request body
        const { orgName, ownerName, email } = req.body;

        // Create a new organization
        const org = new Org({
            orgName,
            ownerName,
            email,
            createdBy: decoded.username  // Store the user who created the organization
        });

        // Save organization to the database
        const savedOrg = await org.save();

        res.status(201).json({ message: 'Organization created successfully', org: savedOrg });

    } catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add user to organization controller
const addUserToOrg = async (req, res) => {
    try {
        // Get token from headers
        const token = req.header('Authorization')?.split(' ')[1];

        // If no token, return forbidden
        if (!token) {
            return res.status(403).json({ message: 'Forbidden: No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Extract user and org details from request body
        const { orgId, username, password, email } = req.body;

        // Check if the organization exists
        const org = await Org.findById(orgId);
        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            username,
            password: hashedPassword,
            email,
            orgId: orgId
        });

        // Save the user to the database
        const savedUser = await user.save();

        res.status(201).json({ message: 'User added to organization', user: savedUser });

    } catch (error) {
        console.error('Error adding user to organization:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export controllers
module.exports = {
    createOrg,
    addUserToOrg
};
