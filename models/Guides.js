const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    events: { type: [Object], required: true }, // Array of event objects
    organization: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Guide', guideSchema);
