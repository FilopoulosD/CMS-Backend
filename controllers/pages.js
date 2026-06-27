const Page = require("../models/Pages");
const Template = require("../models/Templates");

// Get all pages from a specific domain
const getPages = async (req, res) => {
    try {
        const domainId = req.domain._id;
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
        const { name, slug, template: templateId } = req.body;
        const domain = req.domain._id;
        console.log(domain);

        if (!name) {
            return res.status(400).json({ message: "Page name is required" });
        } else if (!slug) {
            return res.status(400).json({ message: "Page slug is required" });
        } else if (!templateId) {
            return res.status(400).json({ message: "Template is required" });
        } else if (!domain) {
            return res.status(400).json({ message: "Domain is required" });
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
            value: field.type === 'repeater' ? [] : null
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
            template = await Template.findById(page.template);
        }

        let updatedContent = page.content;

        if (content) {
            updatedContent = template.fields.map(field => {
                const incomingField = content.find(c => c.name === field.name || c.field === field.name);

                if (!incomingField) {
                    return {
                        name: field.name,
                        type: field.type,
                        value: field.type === 'repeater' ? [] : null
                    };
                }

                let fieldValue;

                if (field.type === 'repeater') {
                    const rowSize = field.subfields.length;
                    const incoming = incomingField.subfields || [];

                    // Group the flat subfields array into rows
                    const rows = [];
                    for (let i = 0; i < incoming.length; i += rowSize) {
                        rows.push(incoming.slice(i, i + rowSize));
                    }

                    fieldValue = rows.map(row => ({
                        subfields: field.subfields.map(subfield => {
                            const match = row.find(sf => sf.name === subfield.name);
                            return {
                                name: subfield.name,
                                value: match ? match.value : null
                            };
                        })
                    }));
                } else {
                    fieldValue = incomingField.value;
                }

                return {
                    name: field.name,
                    type: field.type,
                    value: fieldValue
                };
            });
        }

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
            res.status(400).json({ error: 'Slug must be unique for this domain.' });
        } else if (error.errors && error.errors.slug) {
            res.status(400).json({ error: error.errors.slug.message });
        } else {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

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