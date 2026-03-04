const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
        required: true,
    },

    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
    },
    publishedAt: Date,


}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);