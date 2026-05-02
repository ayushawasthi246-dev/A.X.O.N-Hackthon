import express from "express";
const EventRouter = express.Router()
import { createEvent, updateEvent , allEvents } from "../controller/Event.Controller.js";
import { userauth } from "../middlewear/auth.js";

EventRouter.post("/Create-Event", userauth , createEvent)
EventRouter.post("/Update-Event/:DB_Event_ID", userauth , updateEvent)
EventRouter.get("/Project-Event", userauth , allEvents)

export default EventRouter