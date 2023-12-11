import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ConsoleUser from '../models/consoleUser.js';


const protect = asyncHandler(async (req, res, next) => {
    let token;
    const { verify } = jwt;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get token from header
            token = req.headers.authorization.split(' ')[1];

            // verify the token
            const decoded = verify(token, process.env.JWT_SECRET);

            // get user from the token
            req.user = await ConsoleUser.findById(decoded.id).select('-password');

            next();

        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('not authorized (no token)');
    }
});

export default protect;
