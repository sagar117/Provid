const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' }, // Optional description of the organization
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }, // Indicate if the organization is active
    // Add any other fields necessary for your organization model
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
