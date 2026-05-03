import express from "express";
const EventRouter = express.Router()
import { createEvent, updateEvent , allEvents } from "../controller/Event.Controller.js";
import { MemberAuth } from "../middlewear/MemberAuth.js";

EventRouter.post("/Create-Event", MemberAuth , createEvent)
EventRouter.post("/Update-Event/:DB_Event_ID", MemberAuth , updateEvent)
EventRouter.get("/Project-Event", MemberAuth , allEvents)

export default EventRouter