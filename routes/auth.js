const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens
const router = express.Router();
require('dotenv').config(); // Load environment variables
const Organization = require('../models/organization.model'); // Make sure this is correctly imported
const User = require('../models/user.model'); // Make sure this is correctly imported
const authController = require('../controllers/auth.controller');
const authenticateUser = require('../middleware/auth');  // Your middleware



const users = []; // In-memory user storage

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    const { username, password, email, org_id } = req.body;

    // Validate the input fields
    if (!username || !password || !email || !org_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the organization exists
        const organization = await Organization.findOne({ name: org_id }); // if orgId refers to the name of the organization

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Check if the user already exists by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password (Make sure password is not empty)
        if (!password) {
            return res.status(400).json({ message: 'Password cannot be empty' });
        }
        
        // Properly hash the password with salt rounds (10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user and associate with the organization
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            org: org_id // Assuming 'org' field in User model refers to organization
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error:', error); // Log error for debugging
        res.status(500).json({ message: 'Error registering user', error });
    }
});


// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me
router.get('/me',authenticateUser,authController.me);


// Token refresh route
router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        const dbUser = await User.findOne({ username: user.username });
        if (!dbUser || dbUser.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Refresh token does not match' });
        }

        const newAccessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    });

});



// Get a user by ID
router.get('/users/:username', authController.getUserByUsername);



// Middleware to authenticate requests
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
    if (!token) return res.sendStatus(403); // Forbidden

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

// Export both the router and the authenticateJWT function
module.exports = { router, authenticateJWT };

console.log(authController);  // This should print the exported object with `login` method

