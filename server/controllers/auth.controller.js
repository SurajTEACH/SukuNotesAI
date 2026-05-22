import UserModel from "../models/user.model.js"
import { gettToken } from "../utils/token.js";

export const googleAuth = async (req, res)=>{
    try {
      
       const {name, email} = req.body
       let user = await UserModel.findOne({email});
       if(!user){
          user = await UserModel.create({name, email});
       }

       let token = await gettToken(user._id);

       res.cookie("token", token, {
          httpOnly: true,
          secure: false,//production ke liye true hoga
          sameSite: "strict",// production ke liye lax
          maxAge: 1000 * 60 * 60 * 24 * 7
       });

       res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:`googleSignup error ${error.message}`})
    }
}

export const logOut = async (req, res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({message:"Logout Successfully"});
    } catch (error) {
        return res.status(500).json({message:`logOut error ${error.message}`})
    }
}