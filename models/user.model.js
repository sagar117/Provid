const mongoose = require('mongoose');
const Counter = require('../models/counters'); // Import the counter model


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    org_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true }, // Reference to the Organization model
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }, // Indicate if the user is active
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // User role (optional)
    refreshToken: { type: String }  // Add refreshToken field

    // Add any other fields necessary for your user model
});

// Before saving, get the next sequence for userId
userSchema.pre('save', async function(next) {
    const user = this;
  
    if (user.isNew) {
      try {
        // Get the next userId
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'user' },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        user.userId = counter.seq;
  
        // Get the next orgId for new orgs if needed
        if (!user.org_id) {
          const orgCounter = await Counter.findByIdAndUpdate(
            { _id: 'org' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
          );
          user.org_id = orgCounter.seq;
        }
  
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  });

const User = mongoose.model('User', userSchema);

module.exports = User;


