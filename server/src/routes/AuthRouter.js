import express from "express";
const authRouter = express.Router()
import { LeaderGoogleSingup , refreshAccessToken, MemeberGoogleSingup , allMembersList } from "../controller/User.controller.js";
import { LeaderAuth } from "../middlewear/LeaderAuth.js";
import { MemberAuth } from "../middlewear/MemberAuth.js";

authRouter.post("/LeaderRegister", LeaderGoogleSingup)
authRouter.post("/MemberRegister", MemeberGoogleSingup)
authRouter.get("/MembersList", allMembersList)
authRouter.get("/GenerateAccessToken" , refreshAccessToken)
authRouter.get ("/checkLeaderAuth" , LeaderAuth , (req, res) =>{
    console.log("MAI AAYA")
    res.status(200).json({success: true , message: "User already logged in" , UserData : req.user})
})
authRouter.get ("/checkMemberAuth" , MemberAuth , (req, res) => res.status(200).json({success: true , message: "User already logged in" , UserData : req.user}))
export default authRouter