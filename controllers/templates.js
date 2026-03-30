const Template = require("../models/Templates");

// Get all templates
const getTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new template
const newTemplate = async (req, res) => {
    try {
        const { name, fields } = req.body;

        if (!name || !fields) {
            return res.status(400).json({ message: "Name and fields are required" });
        }

        const template = new Template({ name, fields });
        await template.save();

        res.status(201).json({ message: 'Template created successfully', template });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single template by ID
const getTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.json(template);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Update an existing template
const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, fields } = req.body;

        if (!name && !fields) {
            return res.status(400).json({ message: "Name or fields are required" });
        }

        const updatedTemplate = await Template.findByIdAndUpdate(id, { name, fields }, { new: true });

        if (!updatedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.json({ message: "Template updated successfully", template: updatedTemplate });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Delete an existing template
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTemplate = await Template.findByIdAndDelete(id);

        if (!deletedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getTemplates,
    newTemplate,
    getTemplate,
    updateTemplate,
    deleteTemplate
}