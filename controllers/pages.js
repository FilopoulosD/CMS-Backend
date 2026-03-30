const Page = require("../models/Page");

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
        const { name, domain, slug } = req.body;

        if (!name || !domain || !slug) {
            return res.status(400).json({ message: "Name, domain, and slug are required" });
        }

        const author = req.user;

        const page = new Page({ name, domain, slug, author });
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
        const { name, domain, slug, template, content, seo } = req.body;

        if (!name && !domain && !slug && !template && !content && !seo) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const updatedPage = await Page.findByIdAndUpdate(id,
            {
                name,
                domain,
                slug,
                template,
                content,
                seo
            }, {
            new: true,
            runValidators: true
        });

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