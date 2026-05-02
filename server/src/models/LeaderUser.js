import Mongoose from "mongoose";

const LeaderUserschema = Mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    ProfilePic: { type: String, default: '' },
    Refresh_Token: { type: String, required: true },
}, { timestamps: true })

const LeaderUserModel = Mongoose.models.LeaderUser || Mongoose.model('LeaderUser', LeaderUserschema)
export default LeaderUserModel 