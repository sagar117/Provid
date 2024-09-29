const Org = require('../models/organization.model'); // Import the Organization model
const User = require('../models/user.model'); // Import the User model
const Guide = require('../models/Guides'); // Import the User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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


