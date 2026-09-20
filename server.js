const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const users = require('./routes/users');
const templates = require('./routes/templates');
const pages = require('./routes/pages');
const admin = require('./routes/adminRoutes');

const { domainMiddleware } = require('./middlewares/domainMiddleware');

const mongoose = require('mongoose');

// Load .env variables
require('dotenv').config();

// Express initialize 
const app = express();

//Connect to DB
connectDB();

// Enable Mongoose debug mode for development
// mongoose.set('debug', true);

// Use CORS for Next.JS
app.use(cors());

// Use JSON for res.json (Will be removed probably)
app.use(express.json());

// Load routes
app.use('/', users);

// Domain middleware before all routes
app.use(domainMiddleware);
app.use('/admin/', admin);
app.use('/templates', templates);
app.use('/pages', pages);

// Home Route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express API' });
});

const PORT = process.env.PORT || 5000;
const UMBRELLA = process.env.UMBRELLA_DOMAIN || localhost;

app.listen(PORT, () => {
    console.log(`API running on http://${UMBRELLA}:${PORT}`);
});
