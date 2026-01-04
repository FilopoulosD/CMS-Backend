const express = require('express');
const cors = require('cors');
const database = require('./middlewares/database');

// Load Models
const User = require('./models/Users');

// Load .env variables
require('dotenv').config();
// Express initialize 
const app = express();
//Connect to DB
database();
// Use CORS for Next.JS
app.use(cors());

// Use JSON for res.json (Will be removed propably)
app.use(express.json());
// Home Route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express API' });
});

// Post users route to create first document in Database 
app.post('/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
