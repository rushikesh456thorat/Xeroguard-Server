import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"
import ShopModel from "../models/shop.model.js"
import { Error } from "mongoose"

const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({
                error: "Unautherized - No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({
                error: "Unautherized - Invalid token"
            })
        }

        const user = await UserModel.findById(decoded.userId).select('-password')
        if (!user) {
            return res.status(401).json({
                error: "Unautherized - User does not exist"
            })
        }
        const accessKey = await ShopModel.findById(user.shopId).select('accessKey -_id')
        if (!accessKey){
            throw new Error("Shop Access key Missing");
            
        }
        req.user = {
            id: user._id,
            email: user.email,
            phone: user.phone,
            accessKey:accessKey.accessKey
        }

        next()

    } catch (error) {
        console.log("Error from protectRoute: ", error.message)
        res.status(500).json({ error: "Internal Server Error!" })

    }

}
 export default protectRoute