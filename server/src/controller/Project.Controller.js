import axios from 'axios'
import jwt from 'jsonwebtoken'
import { oauth2Client } from '../config/GoogleApi.js'
import LeaderUserModel from '../models/LeaderUser.js'
import { genrateAcessToken, genrateRefreshToken } from '../util/token.js'
import { google } from 'googleapis'
import ProjectModel from '../models/Project.js'

export const createProject = async (req, res) => {
  const user = req.user;
  const { Data } = req.body

  if (!Data) return res.status(400).json({ message: 'Data missing !!' })

  try {

    const ExistingUser = await LeaderUserModel.findOne({ Email: user.Email })
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })

    await ProjectModel.create({
      User_ID: ExistingUser._id,
      ProjectName: request.data.ProjectName,
      ProjectDescription: request.data.ProjectDescription,
      RepoLink: request.data.RepoLink,
      memberList: request.data.memberList
    })

    return res.status(200).json({ success: "true", message: "Project Created ", request })
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const updateProject = async (req, res) => {
  const user = req.user
  const { DB_Project_ID } = req.param;
  const { Data, Project_ID } = req.body

  if (!Data) return res.status(400).json({ message: 'Data missing !!' })
  try {
    const ExistingUser = await LeaderUserModel.findOne({ Email: user.Email })
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })

    const UpdatedEvent = await ProjectModel.findByIdAndUpdate(
      DB_Project_ID,
      {
        User_ID: ExistingUser._id,
        ProjectName: request.data.ProjectName,
        ProjectDescription: request.data.ProjectDescription,
        RepoLink: request.data.RepoLink,
        memberList: request.data.memberList
      },
      { returnDocument: "after" })

    return res.status(200).json({ success: "true", message: "Event Created ", UpdatedEvent })
  } catch (err) {
    console.error("ERROR SUN : ", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const allProject = async (req, res) => {
  const user = req.user
  try {
    const ExistingUser = await LeaderUserModel.findOne({ Email: user.Email })
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })

    const ProjectList = await ProjectModel.find({ User_ID: ExistingUser._id })
    return res.status(200).json({ success: "true", ProjectList })
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const addmember = async (req,res) =>{
  const {Project_ID} = req.param
  const {Member_ID} = req.body

  if (!Project_ID || !Member_ID){
    return res.status(400).json({ success: "false", message: "user not exists" })
  }

  try {
    const Project = await ProjectModel.findById({Project_ID})
    if(!project) {
      return res.status(400).json({ success: "false", message: "Project not exists" })
    } 


  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { member_ID, role } = req.body

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      {$push: {
          memberList: {
            member_ID,
            role: role
          }
        }},
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
