import axios from 'axios'
import jwt from 'jsonwebtoken'
import { oauth2Client } from '../config/GoogleApi.js'
import { genrateAcessToken, genrateRefreshToken } from '../util/token.js'
import { google } from 'googleapis'
import LeaderUserModel from '../models/LeaderUser.js'
import MemberUserModel from '../models/MemberUser.js'

export const LeaderGoogleSingup = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code missing' });
  }

  try {
    const googleRes = await oauth2Client.getToken(code);

    const requiredScope = 'https://www.googleapis.com/auth/calendar';
    if (!googleRes.tokens.scope || !googleRes.tokens.scope.includes(requiredScope)) {
      console.log("calendar permission is required")
      return res.status(403).json({
        message: "Calendar permission is required"
      });
    }
    oauth2Client.setCredentials(googleRes.tokens);
    console.log("TOKEN : ", googleRes.tokens)

    const Refresh_Token = googleRes.tokens.refresh_token

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleRes.tokens.access_token}`
    );

    console.log("userRes.data : ", userRes.data)

    const { email, name, picture } = userRes.data;

    let User = await LeaderUserModel.findOne({ Email: email });

    if (!User) {
      User = await LeaderUserModel.create({
        Username: name,
        Email: email,
        ProfilePic: picture,
        Refresh_Token
      })
    }

    const accessToken = genrateAcessToken(User._id)
    genrateRefreshToken(User._id, res)

    const Data = { Username: User.Username, Email: User.Email, ProfilePic: User.Profilepic }
    return res.status(200).json({ success: "true", message: "Success fully Signup /Loged in", Response: { Data, accessToken } })

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const MemeberGoogleSingup = async (req, res) => {
  const { code , AccountLink } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code missing' });
  }

  try {
    const googleRes = await oauth2Client.getToken(code);

    const requiredScope = 'https://www.googleapis.com/auth/calendar';
    if (!googleRes.tokens.scope || !googleRes.tokens.scope.includes(requiredScope)) {
      console.log("calendar permission is required")
      return res.status(403).json({
        message: "Calendar permission is required"
      });
    }
    oauth2Client.setCredentials(googleRes.tokens);
    console.log("TOKEN : ", googleRes.tokens)

    const Refresh_Token = googleRes.tokens.refresh_token

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleRes.tokens.access_token}`
    );

    console.log("userRes.data : ", userRes.data)

    const { email, name, picture } = userRes.data;

    let User = await MemberUserModel.findOne({ Email: email });

    if (!User) {
      User = await MemberUserModel.create({
        Username: name,
        Email: email,
        ProfilePic: picture,
        GithubAccLink: AccountLink,
        Refresh_Token
      })
    }

    const accessToken = genrateAcessToken(User._id)
    genrateRefreshToken(User._id, res)

    const Data = { Username: User.Username, Email: User.Email, ProfilePic: User.Profilepic }
    return res.status(200).json({ success: "true", message: "Success fully Signup /Loged in", Response: { Data, accessToken } })

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const refreshAccessToken = async (req, res) => {

  const { refreshToken } = req.cookies

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "refresh token missing . please login again" });
  }

  try {
    const decode = jwt.verify(refreshToken, process.env.Refresh_SECRET)
    console.log("DECODE : ", decode)
    
    const Token = jwt.sign({ id: decode.id }, process.env.Access_SECRET, { expiresIn: "15m" })
    res.json({ success: true, accessToken: Token })

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(440).json({ success: false, message: "Session Expired, Please login again" })
    }
    console.error("Error in register controller yaha hu mai : ", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export const allMembersList = async (req, res) => {
  console.log("121212")
  try {
    const MembersList = await MemberUserModel.find({})
    console.log("1212111111111 : ", MembersList)
    return res.status(200).json({ success: "true", MembersList })
  } catch (err) {
    console.log("ERRROR HAI MUHJMAI :", err)
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

