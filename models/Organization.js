const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guide' }],
});

module.exports = mongoose.model('Organization', OrganizationSchema);

