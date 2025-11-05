import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { upsertnewStreamUser } from '../lib/stream.js';


export async function signup(req,res){
    try {
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }
   
    const index = Math.floor(Math.random() * 100) + 1;
    const randomPic = `https://randomuser.me/api/portraits/lego/${index}.jpg`;
    const newUser = new User({
        fullName,
        email,
        password,
        profilePic: randomPic
    });
  try {
    await upsertnewStreamUser({
        id: newUser._id.toString(),
        name: fullName,
        email: email,
        image: randomPic
    });
    } catch (error) {
        console.error("Error creating Stream user during signup:", error);
    }
    await newUser.save();
    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000});

    
    res.status(201).json({message: "User created successfully"});
    } catch (error) {
        console.log("Error in signup:", error);
        res.status(500).json({message: "Internal server error"});
    }


};


export async function login(req,res){
    try {
        const {email, password} = req.body; 
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }   
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000});
        res.status(200).json({message: "Login successful"});
    } catch (error) {
        console.log("Error in login:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function logout(req,res){
    try {
        res.clearCookie('token');
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        console.log("Error in logout:", error);
        res.status(500).json({message: "Internal server error"});
    }   
}
export async function onboard(req,res){
    try {
        const {nativeLanguage, learningLanguage, location, bio} = req.body; 
        const updateData = {
            nativeLanguage,
            learningLanguage,
            location,
            bio,
            isonboarded: true
        };
        const userId = req.user.userId;
        await User.findByIdAndUpdate(userId, updateData, {new: true});
        res.status(200).json({message: "Onboarding successful"});
    } catch (error) {
        console.log("Error in onboarding:", error);
        res.status(500).json({message: "Internal server error"});
    }
}