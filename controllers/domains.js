const Domain = require("../models/Domains");

const getDomains = async (req, res) => {
    try {
        const domains = await Domain.find();
        res.json(domains);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const newDomain = async (req, res) => {
    try {
        const { host, parentDomain } = req.body;
        const domain = new Domain({ host, parentDomain });
        await domain.save();
        res.status(201).json({ message: 'Domain created successfully', domain });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

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


module.exports = {
    getDomains,
    newDomain,
    getDomain
};