const Page = require("../models/Pages");
const Template = require("../models/Templates");

// Get all pages from a specific domain
const getPages = async (req, res) => {
    try {
        const { domainId } = req.params;
        const pages = await Page.find({ domain: domainId });

        if (!pages) {
            return res.status(404).json({ message: "Pages not found" });
        }

        res.json(pages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Create a new page
const createPage = async (req, res) => {
    try {
        const { name, domain, slug, template: templateId } = req.body;

        if (!name || !domain || !slug || !templateId) {
            return res.status(400).json({ message: "Name, domain, and slug are required" });
        }

        const author = req.user;

        const template = await Template.findById(templateId);

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        // Initialize content based on template fields
        const content = template.fields.map(field => ({
            name: field.name,
            type: field.type,
            value: field.type === 'repeater' ? field.subfields.map(subfield => ({
                name: subfield.name,
                type: subfield.type,
                value: null // Default value for subfields
            })) : null // Default value for non-repeater fields
        }));

        const page = new Page({ name, domain, slug, template: templateId, author, content });
        await page.save();

        res.status(201).json({ message: 'Page created successfully', page });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            res.status(400).json({ error: 'Slug must be unique for this domain.' });
        } else if (error.errors && error.errors.slug) {
            // Handle slug validation error
            res.status(400).json({ error: error.errors.slug.message });
        } else {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }


}

// Get a single page by ID
const getPage = async (req, res) => {
    try {
        const { id } = req.params;
        const page = await Page.findById(id);

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        res.json(page);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Update an existing page
const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, domain, slug, templateId, content, seo } = req.body;

        if (!name && !domain && !slug && !templateId && !content && !seo) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const page = await Page.findById(id);
        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        let template = null;
        if (templateId) {
            template = await Template.findById(templateId);
            if (!template) {
                return res.status(404).json({ message: "Template not found" });
            }
        } else {
            // Use the existing template if no new template is provided
            template = await Template.findById(page.template);
        }

        // Validate and map the content to the template fields
        let updatedContent = page.content; // Default to existing content

        if (content) {
            updatedContent = template.fields.map(field => {
                const incomingField = content.find(c => c.name === field.name);

                if (!incomingField) {
                    // If no content is provided for this field, keep the existing value or set default
                    return {
                        name: field.name,
                        type: field.type,
                        value: field.type === 'repeater' ? field.subfields.map(subfield => ({
                            name: subfield.name,
                            type: subfield.type,
                            value: null // Default value for subfields
                        })) : null,
                        subfields: field.subfields || []
                    };
                }

                // Map the incoming content to the proper field
                return {
                    name: field.name,
                    type: field.type,
                    value: field.type === 'repeater' ? field.subfields.map(subfield => {
                        const incomingSubfield = incomingField.subfields.find(sf => sf.name === subfield.name);
                        return {
                            name: subfield.name,
                            type: subfield.type,
                            value: incomingSubfield ? incomingSubfield.value : null
                        };
                    }) : incomingField.value,
                    subfields: field.subfields || []
                };
            });
        }

        // Update the page
        const updatedPage = await Page.findByIdAndUpdate(
            id,
            {
                name,
                domain,
                slug,
                template: templateId || page.template,
                content: updatedContent,
                seo
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPage) {
            return res.status(404).json({ message: "Page not found" });
        }

        res.status(200).json({
            message: "Page updated successfully",
            page: updatedPage
        });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (e.g., slug uniqueness)
            res.status(400).json({ error: 'Slug must be unique for this domain.' });
        } else if (error.errors && error.errors.slug) {
            // Handle slug validation error
            res.status(400).json({ error: error.errors.slug.message });
        } else {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

// Delete an existing page
const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPage = await Page.findByIdAndDelete(id);

        if (!deletedPage) {
            return res.status(404).json({ message: "Page not found" });
        }

        res.status(200).json({ message: "Page deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getPages,
    createPage,
    getPage,
    updatePage,
    deletePage
}