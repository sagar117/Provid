const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Organization = require('../models/organization.model');

// Registration handler
exports.register = async (req, res) => {
    const { username, password, email, org_id } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
        username,
        password: hashedPassword,
        email,
        org_id,
    });

    try {
        await user.save();
        // Inside your registration logic in auth.controller.js
        console.log('New user created:', { username, hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login handler
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'User logged in successfully', token });
};

// Organization creation handler
exports.createOrganization = async (req, res) => {
    const { name, description } = req.body;

    // Check if the organization already exists
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
        return res.status(400).json({ message: 'Organization already exists' });
    }

    // Create a new organization
    const organization = new Organization({ name, description });

    try {
        await organization.save();
        res.status(201).json({ message: 'Organization created successfully', organization });
    } catch (error) {
        res.status(500).json({ message: 'Error creating organization', error });
    }
};

// Get a user by username
const getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Exporting the functions
module.exports = {
    // ... other exports,
    getUserByUsername,
};