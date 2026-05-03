import jwt from "jsonwebtoken"
import UserModel from "../models/LeaderUser.js"
import LeaderUserModel from "../models/LeaderUser.js"

export const LeaderAuth = async (req, res, next) => {
    
    const authHeader = req.headers.authorization

    console.log("authHeader : ", authHeader)

    console.log("HELLO 1.0")

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        console.log("HELLO 2.0")
        return res.status(401).json({ success: false, message: "No token provided" })
    }
    const accessToken = authHeader.split(" ")[1]
    console.log("ACCESS TOEKN : ", accessToken)
    console.log("HELLO 3.0")
    if (!accessToken) {
        console.log("HELLO 4.0")
        return res.status(401).json({ success: false, message: "Not authorized . Please log in again" })
    }
try {
    const decoded = jwt.verify(accessToken, process.env.Access_SECRET);

    console.log("DECODEDEDEDED :", decoded)
    // Use 'id' because your token.js uses { id: userID }
    const user = await LeaderUserModel.findById(decoded.id)

    console.log("USER :",user)

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.user = user;
    next();
} catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
}
}