const User = require("../models/Users");
const bcrypt = require('bcrypt');
const { validateEmail, validatePassword } = require('../validators/userValidator');
const { generateJWToken } = require('../services/tokenService');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const newUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (validateEmail(email) && validatePassword(password)) {
            const hashedPassword = await bcrypt.hash(password, 12);
            console.log(hashedPassword)
            const user = new User({ name, email, password: hashedPassword, role });
            console.log(user);
            await user.save();
            res.status(201).json({ message: 'User created successfully', user });
        } else if (!validateEmail(email)) {
            res.send('Invalid Email');
        } else if (!validatePassword(password)) {
            res.send('Invalid Password');
        };

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateJWToken(user);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email
            },
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getUsers,
    newUser,
    loginUser
};