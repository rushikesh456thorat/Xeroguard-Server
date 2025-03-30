import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { isEmail, isPhone, isPassword } from '../utils/validateInput.js';
import ShopModel from '../models/shop.model.js';
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const login = async (req, res) => {
    try {
        if (req.body.type === "phone") {
            const { phone, password, role } = req.body;

            if (!isPhone(phone)) {
                return res.status(400).json({ error: "Invalid phone number" });
            }

            const user = await User.findOne({ phone });

            if (!user) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            
            generateTokenAndSetCookie(user._id, res);
            if(role !== user.role){
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            
            // For shop owners, include shop info
            if (user.role === 'shop_owner') {
                const shop = await ShopModel.findById(user.shopId);
                return res.status(200).json({
                    message: "Login Successful",
                    role: user.role,
                    shopAccessKey: shop?.accessKey,
                });
            }
            
            return res.status(200).json({
                message: "Login Successful",
                role: user.role,
            });

        } else {
            const { email, password } = req.body;
            if (!isEmail(email)) {
                return res.status(400).json({ error: "Invalid email" });
            }
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            const isMatch = await bcrypt.compare(password, user?.password || "");
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            
            generateTokenAndSetCookie(user._id, res);
            
            // For shop owners, include shop info
            if (user.role === 'shop_owner') {
                const shop = await ShopModel.findById(user.shopId);
                return res.status(200).json({
                    message: "Login Successful",
                    role: user.role,
                    shopAccessKey: shop?.accessKey,
                });
            }
            
            return res.status(200).json({
                message: "Login Successful",
                role: user.role,
            });
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

export const signup = async (req, res) => {
    try {
        const { email, phone, password, role } = req.body;

        if (!email || !phone || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        if (!isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        if (!isPhone(phone)) {
            return res.status(400).json({ error: "Invalid phone number" });
        }

        if (!isPassword(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and contain at least one uppercase letter"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            email,
            phone,
            password: hashedPassword,
            role
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            // For shop owners, include shop info
            if (newUser.role === 'shop_owner') {
                const shop = await ShopModel.findById(newUser.shopId);
                if (!shop) {
                    return res.status(400).json({ error: "Shop not found" });
                }
                return res.status(201).json({
                    message: "User registered successfully",
                    role: newUser.role,
                    shopAccessKey: shop.accessKey,
                });
            }
            
            return res.status(201).json({
                message: "User registered successfully",
                role: newUser.role,
            });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        return res.status(500).json({ error: "Server error", details: error.message });
    }
}