import Mongoose from "mongoose";

const MemberUserschema = Mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    ProfilePic: { type: String, default: '' },
    Refresh_Token: { type: String, required: true },
    GithubAccLink: { type: String, required: true },
}, { timestamps: true })

const MemberUserModel = Mongoose.models.MemberUser || Mongoose.model('MemberUser', MemberUserschema)
export default MemberUserModel 