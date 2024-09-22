const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Guide', GuideSchema);

