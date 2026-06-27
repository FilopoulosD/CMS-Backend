const Domain = require('../models/Domains');

const domainMiddleware = async (req, res, next) => {
    try {
        let host = req.headers.host?.toLowerCase().replace(/:\d+$/, '');

        if (host === process.env.UMBRELLA_DOMAIN) {
            req.isUmbrella = true;
            req.domain = null
            return next();
        };

        const domain = await Domain.findOne({ host });

        if (!domain) {
            return res.status(404).json({ message: `No site found for host: ${host}` });
        }

        req.domain = domain;
        req.isUmbrella = false
        next();

    } catch (e) {
        next(e);
    }
};

module.exports = { domainMiddleware };