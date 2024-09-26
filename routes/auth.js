const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating tokens
const router = express.Router();
require('dotenv').config(); // Load environment variables

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
        const organization = await Org.findById(org_id);
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

// Get user by username
router.get('/user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
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
