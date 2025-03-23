import ShopModel from "../models/shop.model.js"


export const shop = async(req,res) =>{
    const {accessKey} = req.params

    


    const shop = await ShopModel.findOne({accessKey}).select('-_id -__v -accessKey -createdAt')
    if(!shop){
        return res.status(404).json({message: 'Shop not found'})
    }

    return res.status(200).json(
        shop
    )
}

export const shopName = async(req,res) =>{
    const {accessKey} = req.params

    const shopName = await ShopModel.findOne({accessKey}).select('name')
    if(!shopName){
        return res.status(404).json({message: 'Shop not found'})
    }

    return res.status(200).json({
        shopName: shopName.name
    })
}
export const profilePic = async(req,res) =>{
    const {accessKey} = req.params

    const shopProfile = await ShopModel.findOne({accessKey}).select('profilePic')
    if(!shopProfile){
        return res.status(404).json({message: 'Shop not found'})
    }

    return res.status(200).json({
        profilePic: shopProfile.profilePic
    })
}
export const shopCode = async(req,res) =>{
    const {accessKey} = req.params

    const shopCode = await ShopModel.findOne({accessKey}).select('shopCode')
    if(!shopCode){
        return res.status(404).json({message: 'Shop not found'})
    }

    return res.status(200).json({
        shopCode: shopCode.shopCode
    })
}