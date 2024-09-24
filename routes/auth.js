const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens
const router = express.Router();
require('dotenv').config(); // Load environment variables

const users = []; // In-memory user storage

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered' });
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'User logged in', token });
});

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
