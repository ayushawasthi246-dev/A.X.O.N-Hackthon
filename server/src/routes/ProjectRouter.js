import express from "express";
const ProjectRouter = express.Router()
import { createProject , updateProject , allProject } from "../controller/Project.Controller.js"
import { userauth } from "../middlewear/auth.js"

ProjectRouter.post("/Create-Project", userauth , createProject)
ProjectRouter.post("/Update-Project/:DB_Event_ID", userauth , updateProject)
ProjectRouter.get("/Project-List", userauth , allProject)

export default ProjectRouter