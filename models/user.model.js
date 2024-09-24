const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    org_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true }, // Reference to the Organization model
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }, // Indicate if the user is active
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // User role (optional)
    // Add any other fields necessary for your user model
});

const User = mongoose.model('User', userSchema);

module.exports = User;
