import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const protect = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"});
    }   
};

export default protect;