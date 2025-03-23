import mongoose from "mongoose";
import crypto from "crypto"; // For generating unique codes
import ShopModel from "../models/shop.model.js"; // Import ShopModel

const UserModelSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "ShopModel" }
});

// Generate a unique 16-character alphanumeric key
const generateUniqueKey = async (field) => {
    let uniqueKey;
    let exists = true;

    while (exists) {
        uniqueKey = crypto.randomBytes(8).toString("hex").toUpperCase(); // Generates a 16-char key
        exists = await ShopModel.findOne({ [field]: uniqueKey });
    }

    return uniqueKey;
};

// Create a shop before saving a new user
UserModelSchema.pre("save", async function (next) {
    if (!this.shopId) {
        try {
            console.log("Generating accessKey and shopCode...");
            const accessKey = await generateUniqueKey("accessKey");
            const shopCode = await generateUniqueKey("shopCode");

            console.log("Creating shop with:", { accessKey, shopCode });

            // Create and save the shop
            const newShop = new ShopModel({ accessKey, shopCode });
            await newShop.save();

            this.shopId = newShop._id;
            console.log("Shop created with ID:", this.shopId);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const UserModel = mongoose.model("UserModel", UserModelSchema);
export default UserModel;
