import jwt from "jsonwebtoken"
import UserModel from "../models/LeaderUser.js"

export const MemberAuth = async (req, res, next) => {
    
    const authHeader = req.headers.authorization

    console.log("HELLO 1")

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        console.log("HELLO 2")
        return res.status(401).json({ success: false, message: "No token provided" })
    }
    const accessToken = authHeader.split(" ")[1]
    console.log("HELLO 3")
    if (!accessToken) {
        console.log("HELLO 4")
        return res.status(401).json({ success: false, message: "Not authorized . Please log in again" })
    }
    try {
        console.log("1212")

        const decoded = jwt.verify(accessToken, process.env.Access_SECRET)
        console.log("12123233223")
        console.log("process.env.Access_SECRET : ",process.env.Access_SECRET )
        console.log("DECODED 2121112 : ",decoded )
        if (!decoded) return res.status(401).json({ success: false, message: "Not authorized . Please log in again" })
            console.log("DECODED 12 : ",decoded )
            console.log("121215456465456452")
            const user = await UserModel.findById(decoded.id).select("Username Email ProfilePic")
            console.log("USER5454 : ", user)
            if (!user) return res.status(404).json({ success: false, message: "user not exists" })

                console.log("USER : ", user)
                
        req.user = user
        next()

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" })
    }
}