import mongoose from "mongoose";

const ShopModelSchema = new mongoose.Schema({
    accessKey: { type: String, unique: true, required: true },
    shopCode: { type: String, unique: true, required: true },
    name: { type: String, default: '' },
    profilePic: { type: String, default: "" },
    settings: { type: Object, default: {} },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "UserModel",
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const ShopModel = mongoose.model("ShopModel", ShopModelSchema);
export default ShopModel;