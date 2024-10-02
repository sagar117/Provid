const mongoose = require('mongoose');
const Counter = require('./counter.model'); // Make sure the path is correct



const organizationSchema = new mongoose.Schema({
    orgId: { type: Number, unique: true }, // Incremental org ID
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    description: { type: String, default: '' }, // Optional description of the organization
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }, // Indicate if the organization is active
    // Add any other fields necessary for your organization model
});

// Before saving, get the next sequence for orgId
organizationSchema.pre('save', async function (next) {
    const organization = this;

    if (organization.isNew) {
        try {
            // Get the next orgId sequence from the counter collection
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'org' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            organization.orgId = counter.seq;

            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});


const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;