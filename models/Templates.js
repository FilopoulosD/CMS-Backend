const mongoose = require('mongoose');

const SubfieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'richtext', 'image', 'number', 'boolean', 'url']
    },
    required: {
        type: Boolean,
        default: false
    },
})

const FieldSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['text', 'textarea', 'richtext', 'image', 'number', 'boolean', 'url', 'repeater']
    },
    required: {
        type: Boolean,
        default: false
    },
    subfields: {
        type: [SubfieldSchema],
        default: []
    }

});

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fields: {
        type: [FieldSchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);