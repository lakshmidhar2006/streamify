import express from 'express';
import "dotenv/config";
import authroutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from './routes/chatRoutes.js';
import { connectdb } from './lib/dib.js';
import cookieParser from 'cookie-parser';


const app= express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;


app.use('/api/auth',authroutes);
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.listen(port,()=>{
    connectdb();
    console.log("serve is running at localhost5000");
})