import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        console.log(req.cookies)
        const token=req.cookies?.accessToken||req.header("Authrization")?.replace('Bearer ',"");
        console.log(token);
        if(!token){
            throw new ApiError(401,"Unauthorized request");
        }
        console.log(process.env.ACCESS_TOKEN_SECRET)
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken)
    
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
        // console.log(user,'-->',user._id)
    
        if(!user){
            throw new ApiError(401,'Invalid Access Token');
        }
    
        req.user=user;

        next();
    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid access token")
    }
})