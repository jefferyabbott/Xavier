import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import consoleUser from '../models/consoleUser.js';

const { genSalt, hash, compare } = bcrypt;
const { sign } = jwt;

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    const userExists = await consoleUser.findOne({email});
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // hash the password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // create user
    const user = await consoleUser.create({
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await consoleUser.findOne({email});

    // check password
    if (user && (await compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// generate JWT
const generateToken = (id) => {
    return sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    });
}

export {
    registerUser,
    loginUser,
    complianceCardPref
}

