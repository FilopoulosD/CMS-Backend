const mongoose = require('mongoose');
const { validateSlug } = require('../validators/pageValidator');

// Subfield schema for content
const ContentSubfieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'richtext', 'image', 'number', 'boolean', 'url']
    },
    value: mongoose.Schema.Types.Mixed // Can store any type of value
});

// Field schema for content
const ContentFieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'richtext', 'image', 'number', 'boolean', 'url', 'repeater']
    },
    value: mongoose.Schema.Types.Mixed, // Can store any type of value
    subfields: {
        type: [ContentSubfieldSchema],
        default: []
    }
});

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
        lowercase: true,
        validate: {
            validator: validateSlug,
            message: 'Slug is not valid. It must only contain lowercase letters, numbers, and hyphens.'
        }
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
        type: [ContentFieldSchema],
        default: []
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
    },
    publishedAt: Date,


}, { timestamps: true });

pageSchema.index({ slug: 1, domain: 1 }, { unique: true });

module.exports = mongoose.model('Page', pageSchema);