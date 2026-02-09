const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
    host: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    parentDomain: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    themeConfig: {
        primaryColor: { type: String, default: '#0d0047' },
        logoUrl: { type: String },
        faviconUrl: { type: String },
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'suspended'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Domain', domainSchema);