const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    assets: {
        type: [String],
        default: [],
    },
    investorType: {
        type: String,
        enum: [],
        default: null,
    },
    contentType: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('UserData', UserDataSchema);
