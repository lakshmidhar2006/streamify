 import mongoose from 'mongoose';
 import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String,minlength :6, required: true},
    bio: {type: String, default: ""},
    profilePic: {type: String, default: ""},
    nativeLanguage: {type: String, default: "English"},
    learningLanguage: {type: String, default: "Spanish"},
    location: {type: String, default: ""},
    isonboarded: {type: Boolean, default: false},
    friends: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: []},
},{ timestamps: true });

userSchema.pre('save', async function(next) {
    try{
    if (!this.isModified('password')) {
        return next();
    }   
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    } catch (error) {
        next(error);
    }
});

export const User = mongoose.model('User', userSchema);