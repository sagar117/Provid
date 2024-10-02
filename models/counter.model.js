// models/counter.model.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // This will be the name of the counter (e.g., 'user' or 'org')
    seq: { type: Number, default: 0 } // The sequence number
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
