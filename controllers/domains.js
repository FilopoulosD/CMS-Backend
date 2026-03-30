const Domain = require("../models/Domains");

// Get all domains
const getDomains = async (req, res) => {
    try {
        const domains = await Domain.find();
        res.json(domains);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new domain
const newDomain = async (req, res) => {
    try {
        const { host, parentDomain } = req.body;

        if (!host) {
            return res.status(400).json({ message: "Host is required" });
        }

        const domain = new Domain({ host, parentDomain });
        await domain.save();

        res.status(201).json({ message: 'Domain created successfully', domain });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Get a single domain by ID
const getDomain = async (req, res) => {
    try {
        const { id } = req.params;
        const domain = await Domain.findById(id);

        if (!domain) {
            return res.status(404).json({ message: 'Domain not found' });
        }

        res.json(domain);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an existing domain
const updateDomain = async (req, res) => {
    try {
        const { id } = req.params;
        const { host, parentDomain } = req.body || {};

        if (!host && !parentDomain) {
            return res.status(400).json({ message: "Host or parent domain are required" });
        }

        const updatedDomain = await Domain.findByIdAndUpdate(
            id,
            { host, parentDomain },
            { new: true, runValidators: true }
        );

        if (!updatedDomain) {
            return res.status(404).json({ message: 'Domain not found' });
        }

        res.status(200).json({
            message: "Domain updated successfully",
            domain: updatedDomain
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Delete an existing domain
const deleteDomain = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDomain = await Domain.findByIdAndDelete(id);

        if (!deletedDomain) {
            return res.status(404).json({ message: 'Domain not found' });
        }

        res.status(200).json({ message: 'Domain deleted successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getDomains,
    newDomain,
    getDomain,
    updateDomain,
    deleteDomain
};