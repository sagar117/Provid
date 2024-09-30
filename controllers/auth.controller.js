const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Organization = require('../models/organization.model');


console.log(jwt);

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
}

// User login
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username }).populate('org_id');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, orgId: user.org_id._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id, orgId: user.org_id._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Return success response
        res.status(200).json({
            message: 'Login successful',
            token,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                org: user.org_id.name
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
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


exports.me = async (req, res) => {
    try {
        // Extract the user ID from the authenticated request (e.g., from a JWT token or session)
        const userId = req.user._id; // Assume req.user contains the authenticated user's data

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch organization details using the user's orgId
        const organization = await Org.findById(user.orgId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Combine user and organization details into the response
        const userDetails = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,  // Add other user fields as necessary
            },
            organization: {
                id: organization._id,
                name: organization.name,
                description: organization.description,
                address: organization.address,  // Add other org fields as necessary
            }
        };

        // Send back the combined user and organization details
        res.status(200).json(userDetails);

    } catch (error) {
        console.error('Error fetching user or organization details:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Exporting the functions
module.exports = {
    // ... other exports,
    getUserByUsername,
    login,
};