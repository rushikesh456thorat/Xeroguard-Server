import express  from "express";
import { setProfilePic, setShopName } from "../controllers/setdata.controller.js";
import protectRoutes from "../middleware/protectRoute.js"


const router =  express.Router()

router.post("/shopName",protectRoutes,setShopName)
router.post("/profilePic",protectRoutes,setProfilePic)


export default router