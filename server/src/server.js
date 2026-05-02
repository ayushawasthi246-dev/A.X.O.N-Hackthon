import express from "express";
import 'dotenv/config';
import cors from 'cors'
import cookieParser from "cookie-parser"
import ProjectRouter from "./routes/ProjectRouter.js";
import authRouter from "./routes/authRouter.js";
import EventRouter from "./routes/EventRouter.js";
import connectdb from "./config/mongodb.js"

const app = express();
app.use(express.json());

const allowedorigin = ['http://localhost:5173' ,'https://Inlango.vercel.app']

const port = 3000;
connectdb();

app.use(cookieParser());
app.use(cors({ origin : allowedorigin , credentials: true }));

app.use("/auth" , authRouter)
app.use("/Project" , ProjectRouter)
app.use("/EventRouter" , EventRouter)
app.listen(port, () => { console.log(`Server is runing on the Port : ${port}`) })