import Mongoose from "mongoose";

const eventSchema = Mongoose.Schema({
    Event_ID : { type: String, required: true , unique: true  },
    User_ID : { type: String, required: true , unique: true  },
    Summary: { type: String, required: true },
    Location: { type: String, required: true },
    Description: { type: String, required: true },
    ColorId: { type: String, required: true },
    Start: { type: String, required: true },
    End: { type: String, required: true },
    Completed : { type: Boolean, required: true , default: false },
}, { timestamps: true })

const EventModel = Mongoose.models.Events || Mongoose.model('Events', eventSchema)
export default EventModel