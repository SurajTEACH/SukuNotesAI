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

       const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes("localhost"));

       res.cookie("token", token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7
       });

       const userObj = user.toObject();
       userObj.token = token;

       res.status(200).json(userObj);
    } catch (error) {
        return res.status(500).json({message:`googleSignup error ${error.message}`})
    }
}

export const logOut = async (req, res)=>{
    try {
        const isProduction = process.env.NODE_ENV === 'production' || (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes("localhost"));
        res.clearCookie("token", {
           httpOnly: true,
           secure: isProduction,
           sameSite: isProduction ? "none" : "lax"
        });
        res.status(200).json({message:"Logout Successfully"});
    } catch (error) {
        return res.status(500).json({message:`logOut error ${error.message}`})
    }
}