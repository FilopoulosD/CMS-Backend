const express = require('express');
const cors = require('cors');
const database = require('./middlewares/database');
const users = require('./routes/users');


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

// Load routes
app.use('/', users);


// Home Route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express API' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
