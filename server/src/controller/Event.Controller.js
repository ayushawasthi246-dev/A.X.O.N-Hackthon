import axios from 'axios'
import jwt from 'jsonwebtoken'
import { oauth2Client } from '../config/GoogleApi.js'
import UserModel from '../models/LeaderUser.js'
import { genrateAcessToken, genrateRefreshToken } from '../util/token.js'
import { google } from 'googleapis'
import EventModel from '../models/Events.js'

export const createEvent = async (req, res) => {
  const user = req.user;
  const { Data } = req.body;

  console.log("Data : ", Data)
  console.log("user : ", user)

  if (!Data) return res.status(400).json({ message: 'Data missing !!' })

  try {

    const ExistingUser = await UserModel.findOne({ Email: user.Email })
    console.log("ExistingUser : ", ExistingUser)
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })

    const startISO = new Date(Data.StartingPoint).toISOString();
    const endISO = new Date(Data.EndingPoint).toISOString();

    console.log("startISO : ", startISO)
    console.log("endISO : ", endISO)

    const event = {
      'summary': Data.Title,
      'location': Data.Location,
      'description': Data.Summary,
      'colorId': '6',
      'start': {
        dateTime: startISO,
        timeZone: 'UTC',
      },
      'end': {
        dateTime: endISO,
        timeZone: 'UTC',
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'popup', 'minutes': 0 },
          { 'method': 'popup', 'minutes': 10 }
        ]
      }
    };
    oauth2Client.setCredentials({ refresh_token: ExistingUser.Refresh_Token })
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const request = await calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    })

    await EventModel.create({
      User_ID: ExistingUser._id,
      Event_ID: request.data.id,
      Summary: request.data.summary,
      Location: request.data.location,
      Description: request.data.description,
      ColorId: request.data.colorId,
      Start: request.data.start.dateTime,
      End: request.data.end.dateTime,
      Description: request.data.description,
    })

    console.log("request : ", request)

    return res.status(200).json({ success: "true", message: "Event Created ", request })
  } catch (err) {
    console.error("ERROR SUN : ", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const updateEvent = async (req, res) => {
  const user = req.user
  const { DB_Event_ID } = req.param;
  const { Data , Event_ID } = req.body

  if (!Data) return res.status(400).json({ message: 'Data missing !!' })
  try {
    const ExistingUser = await UserModel.findOne({ Email: user.Email })
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })

    const startISO = new Date(Data.StartingPoint).toISOString();
    const endISO = new Date(Data.EndingPoint).toISOString();

    const updatedEventResource = {
      'summary': Data.Title,
      'location': Data.Location,
      'description': Data.Summary,
      'colorId': '6',
      'start': {
        dateTime: startISO,
        timeZone: 'UTC',
      },
      'end': {
        dateTime: endISO,
        timeZone: 'UTC',
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'popup', 'minutes': 0 },
          { 'method': 'popup', 'minutes': 10 }
        ]
      }
    };
    oauth2Client.setCredentials({ refresh_token: ExistingUser.Refresh_Token })
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const request = await calendar.events.update({
      'calendarId': 'primary',
      'eventId': Event_ID,
      'resource': updatedEventResource
    })

    const UpdatedEvent = await EventModel.findByIdAndUpdate(
      DB_Event_ID,
      {
        User_ID: ExistingUser._id,
        Event_ID: request.data.id,
        Summary: request.data.summary,
        Location: request.data.location,
        Description: request.data.description,
        ColorId: request.data.colorId,
        Start: request.data.start.dateTime,
        End: request.data.end.dateTime,
        Description: request.data.description,
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

export const allEvents = async (req, res) => {
  const user = req.user

  console.log("USER HAI YAHA : ", user)
  console.log("U-1")
  try {
    console.log("U-2")
    const ExistingUser = await UserModel.findOne({ Email: user.Email })
    console.log("U-3")
    if (!ExistingUser) return res.status(400).json({ success: "false", message: "user not exists" })
      console.log("U-4")
    
    const EventList = await EventModel.find({User_ID : ExistingUser._id})
    console.log("U-5")
    
    return res.status(200).json({ success: "true", message: "Event Created ", EventList })
  } catch (err) {
    console.log("U-6")
    console.error("ERROR SUN : ", err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}