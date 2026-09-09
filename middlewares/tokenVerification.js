import jwt from "jsonwebtoken";
import UserModel from "../models/usermodel.js";
import config from "../config/config.js";

export const isVerifiedUser = () => {
  return async (req, res, next) => {
    try {

      
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "No token provided"
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      );
      
      
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

  

     

      req.user = user;

      next();

    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired, login again"
        });
      }

      return res.status(401).json({
        message: "Invalid token"
      });
    }
  };
};