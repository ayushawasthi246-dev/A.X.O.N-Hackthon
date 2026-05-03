import axios from 'axios'
import jwt from 'jsonwebtoken'
import { oauth2Client } from '../config/GoogleApi.js'
import LeaderUserModel from '../models/LeaderUser.js'
import { genrateAcessToken, genrateRefreshToken } from '../util/token.js'
import { google } from 'googleapis'
import ProjectModel from '../models/Project.js'
import MemberUserModel from '../models/MemberUser.js'

export const createProject = async (req, res) => {
  const user = req.user;
  const { Data } = req.body;

  console.log("DAAAAAAAAAAATA : ",Data)

  if (!Data) return res.status(400).json({ message: 'Data missing !!' })
  try {
    const ExistingUser = await LeaderUserModel.findOne({ Email: user.Email })
    console.log("ExistingUser : ", ExistingUser)
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })

    await ProjectModel.create({
      User_ID: ExistingUser._id, // Populate from LeaderAuth middleware
      ProjectName: Data.ProjectName,
      ProjectDescription: Data.ProjectDescription,
      RepoLink: Data.RepoLink,
      memberList: Data.memberList
    });
    return res.status(200).json({ success: "true", message: "Event Created " })
  } catch (err) {
    console.error("ERROR SUN : ", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

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
  console.log("1")
  try {
    console.log("1.5")
    const ExistingUser = await LeaderUserModel.findOne({ Email: user.Email })
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })
    console.log("2")
    const ProjectList = await ProjectModel.find({ User_ID: ExistingUser._id })
    return res.status(200).json({ success: "true", ProjectList })
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const allMembersProject = async (req, res) => {
  try {
    const user = req.user;

    const ExistingUser = await MemberUserModel.findOne({ Email: user.Email });

    if (!ExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist"
      });
    }

    const ProjectList = await ProjectModel.find({
      $or: [
        { User_ID: ExistingUser._id },
        { "memberList.member_ID": ExistingUser._id }
      ]
    });

    return res.status(200).json({
      success: true,
      ProjectList
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { member_ID, role } = req.body

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        $push: {
          memberList: {
            member_ID,
            role: role
          }
        }
      },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
