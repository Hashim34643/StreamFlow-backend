const jwt = require("jsonwebtoken");
const User = require("../models/create-user");

const isAuth = async (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).json({success: false, message: "Unauthorized access!"});
    }
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized access!"});
        }
        try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({success: false, message: "Unauthorized access!"});
        }
        req.user = user;
        next();
    } catch (error) {
        if(error.name === "JsonWebTokenError") {
            return res.status(401).json({success: false, message: "Unauthorized access!"});
        };
        if(error.name === "TokenExpiredError") {
            return res.status(401).json({success: false, message: "Session expired, try sign-in"});
        }
        return res.status(500).json({success: false, message: "Internal server error!"});   
    }
    } else {
        return res.status(401).json({success: false, message: "Unauthorized access!"});
    }
};

module.exports = isAuth;