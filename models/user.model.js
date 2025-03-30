import mongoose from "mongoose";
import crypto from "crypto";
import ShopModel from "../models/shop.model.js";

const UserModelSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['customer', 'shop_owner'],
        default: 'customer'
    },
    shopId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ShopModel",
        // Remove required here and handle it in pre-save
    }
});

const generateUniqueKey = async (field) => {
    let uniqueKey;
    let exists = true;

    while (exists) {
        uniqueKey = crypto.randomBytes(8).toString("hex").toUpperCase();
        exists = await ShopModel.findOne({ [field]: uniqueKey });
    }

    return uniqueKey;
};

UserModelSchema.pre("save", async function (next) {
    // Only proceed for shop owners
    if (this.role === 'shop_owner') {
        try {
            // If shop already exists (maybe from a retry), skip creation
            if (this.shopId) return next();

            const accessKey = await generateUniqueKey("accessKey");
            const shopCode = await generateUniqueKey("shopCode");

            const newShop = new ShopModel({
                accessKey,
                shopCode,
                owner: this._id // Add owner reference
            });

            await newShop.save();
            this.shopId = newShop._id;
            
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const UserModel = mongoose.model("UserModel", UserModelSchema);
export default UserModel;