import express from "express";
const authRouter = express.Router()
import { LeaderGoogleSingup , refreshAccessToken, MemeberGoogleSingup , allMembersList } from "../controller/User.controller.js";
import { userauth } from "../middlewear/auth.js";

authRouter.post("/LeaderRegister", LeaderGoogleSingup)
authRouter.post("/MemberRegister", MemeberGoogleSingup)
authRouter.post("/MembersList", allMembersList)
authRouter.get("/GenerateAccessToken" , refreshAccessToken)
authRouter.get ("/checkAuth" , userauth , (req, res) => res.status(200).json({success: true , message: "User already logged in" , UserData : req.user}))
export default authRouter