import ShopModel from "../models/shop.model.js";
import { isUrl } from "../utils/validateInput.js";

export const setShopName = async (req, res) => {
    try {
        const { shopName } = req.body;
        const { accessKey } = req.user;

        if (!shopName) {
            return res.status(400).json({ message: "Please enter a shop name" });
        }

        const updateShop = await ShopModel.findOneAndUpdate(
            { accessKey: accessKey },
            { name: shopName },
            { new: true }
        );

        if (!updateShop) {
            return res.status(404).json({ message: "Invalid access key" });
        }
        updateShop.save()

        return res.status(200).json({
            message: "Shop name updated successfully",
            shopName: updateShop.name
        });

    } catch (error) {
        console.error("Error updating shop name:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const setProfilePic = async (req, res) => {
    try {
        const { url } = req.body
        const { accessKey } = req.user
        
        if (!url || isUrl(url)) {
            return res.status(400).json({
                message: "Please enter a valid URL for profile picture"
            })
        }

        const updateShop = await ShopModel.findOneAndUpdate(
            { accessKey: accessKey },
            { profilePic: url },
            { new: true }
        );

        if (!updateShop) {
            return res.status(404).json({ message: "Invalid access key" });
        }
        updateShop.save()
        return res.status(200).json({
            message: "Shop name updated successfully",
            profilePic: updateShop.profilePic
        });
    } catch (error) {
        console.error("Error updating shop name:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}


