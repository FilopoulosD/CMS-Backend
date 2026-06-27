const mongoose = require('mongoose');
const { validateSlug } = require('../validators/pageValidator');

const ContentSubfieldValueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },  // matches subfield name in template
    value: mongoose.Schema.Types.Mixed
});

const ContentRepeaterRowSchema = new mongoose.Schema({
    subfields: [ContentSubfieldValueSchema]
});

// Field schema for content
const ContentFieldSchema = new mongoose.Schema({
    name: { type: String, required: true },  // matches field name in template
    type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'richtext', 'image', 'number', 'boolean', 'url', 'repeater']
    },
    value: mongoose.Schema.Types.Mixed,         // used for all non-repeater types
    repeaterValue: [ContentRepeaterRowSchema]   // used only when type === 'repeater'
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
    status: {
        type: String,
        enum: ['draft', 'published', 'scheduled'],
        default: 'draft'
    },

    publishedAt: Date,


}, { timestamps: true });

pageSchema.index({ slug: 1, domain: 1 }, { unique: true });

module.exports = mongoose.model('Page', pageSchema);