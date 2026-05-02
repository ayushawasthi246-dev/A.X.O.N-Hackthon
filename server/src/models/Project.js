import Mongoose from "mongoose";

const memberSchema = Mongoose.Schema({
    member_ID: { type: Mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, required: true }
}, { _id: false })

const ProjectSchema = Mongoose.Schema({
    User_ID: { type: Mongoose.Schema.Types.ObjectId, required: true },
    ProjectName: { type: String, required: true },
    ProjectDescription: { type: String, required: true },
    RepoLink: { type: String, required: true },
    memberList: { type: [memberSchema], default: [] },
    Completed: { type: Boolean, default: false },
}, { timestamps: true });

const ProjectModel = Mongoose.models.Projects || Mongoose.model('Projects', ProjectSchema)
export default ProjectModel