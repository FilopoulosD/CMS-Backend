const umbrellaOnlyMiddleware = (req, res, next) => {

    if (req.isUmbrella) {
        return next();
    }

    const protocol = req.protocol || 'https';
    const umbrellaUrl = `${protocol}://${process.env.UMBRELLA_DOMAIN}${req.originalUrl}`;

    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(403).json({
            success: false,
            message: 'Admin routes are only accessible from the main admin panel',
            redirectTo: umbrellaUrl
        });
    };

    return res.redirect(301, umbrellaUrl);
};

const nonUmbrellaMiddleware = (req, res, next) => {
    if (!req.isUmbrella) {
        return next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Cant have pages for the umbrella domain'
        });
    }
}

module.exports = {
    umbrellaOnlyMiddleware,
    nonUmbrellaMiddleware
}