const Template = require("../models/Templates");

const getTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const newTemplate = async (req, res) => {
    try {
        const { name, fields } = req.body;
        const template = new Template({ name, fields });
        await template.save();
        res.status(201).json({ message: 'Template created successfully', template });
    } catch (err) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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

module.exports = {
    getTemplates,
    newTemplate,
    getTemplate
}