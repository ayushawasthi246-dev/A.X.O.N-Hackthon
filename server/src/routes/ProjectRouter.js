import express from "express";
const ProjectRouter = express.Router()
import { createProject , updateProject , allProject , allMembersProject } from "../controller/Project.Controller.js"
import { LeaderAuth } from "../middlewear/LeaderAuth.js";
import { MemberAuth } from "../middlewear/MemberAuth.js";

ProjectRouter.post("/Create-Project", LeaderAuth , createProject)
ProjectRouter.post("/Update-Project/:DB_Event_ID", LeaderAuth , updateProject)
ProjectRouter.get("/Project-List", LeaderAuth , allProject)
ProjectRouter.get("/Members-Project-List", MemberAuth , allMembersProject)

export default ProjectRouter