import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import consoleUser from '../models/consoleUser.js';
import isAdministrator from '../utilities/checkPrivileges.js';

const { genSalt, hash, compare } = bcrypt;
const { sign } = jwt;

// @desc    Register new user
// @route   POST /api/users/register
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

    // check for existing users
    // if none exist, then give the new user admin rights
    // otherwise, give the new user read-only aduditor rights

    const existingUsers = await consoleUser.find();

    // create user
    const user = await consoleUser.create({
        name,
        email,
        password: hashedPassword,
        userType: (existingUsers && existingUsers.length > 0) ? 'consoleAuditor': 'consoleAdministrator'
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Create new user
// @route   POST /api/users/createNewUser
// @access  Private
const createNewUser = asyncHandler(async (req, res) => {

    // const requestingUser = await consoleUser.findOne({ _id: req.user._id }).select(['-password']);
    // if (requestingUser.userType !== 'consoleAdministrator') {
    //     res.status(400);
    //     throw new Error('This request must be made by an administrator');
    // }
    if (!isAdministrator(req.user._id)) {
        res.status(400);
        throw new Error('This request must be made by an administrator');
    }

    const { name, email, password, userType } = req.body;
    if (!name || !email || !password || !userType) {
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
    const newUser = await consoleUser.create({
        name,
        email,
        password: hashedPassword,
        userType
    });

    if (newUser) {
        res.status(201).json({
            message: `New user account for ${name} has been created.`
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
            userType: user.userType,
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
    createNewUser
}

