import express from "express";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "../lib/redis.js";

dotenv.config();


const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    try {
        await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // Expire in 7 days
    } catch (error) {
        throw new Error("Failed to store refresh token");
    }
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,// Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === "development",// Ensures the cookie is only sent over HTTPS in production
        sameSite: "strict",// Prevents the cookie from being sent in cross-site requests
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,// Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === "development",// Ensures the cookie is only sent over HTTPS in production   
        sameSite: "strict",// Prevents the cookie from being sent in cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const login = async(req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({ message: "Logged in successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
        }, accessToken, refreshToken });
        
    } 
    else {
        res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
  
};

export const logout = async(req, res) => {
  try{
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refreshToken:${decoded.userId}`);
    
    } 
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message:"Failed to logout" ,error: error.message });
  }
};

export const signup = async (req, res) => {
    const { name, email, password , phoneNumber} = req.body;

    try{
        const userExists = await User.findOne({ email });
        if (userExists) {
        return res.status(400).json({ message: "User already exists" });
       }
        const user = await User.create({ name, email, password, phoneNumber });
        //authenticate  user 
        const {accessToken,refreshToken}=generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({ message: "User created successfully", user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,

        }, accessToken, refreshToken });

    }catch(error){

        console.error("ERREUR CRUCIALE SIGNUP :", error); // 💡 AJOUTEZ CETTE LIGNE ICI
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;  
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
       const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
       res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.status(200).json({ message: "Tokens refreshed successfully"});
    } catch (error) {
        console.log("Error refreshing token:", error.message);
        res.status(401).json({ message: "Server Error", error: error.message });
    }
};  


export const getProfile =async(req,res)=>{
       try{
          const response = await res.json(req.user);
          return response;
       }catch(error){
          res.status(500).json({message:"Server Error",error:error.message});
       }
}