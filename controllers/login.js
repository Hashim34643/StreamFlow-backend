const User = require("../models/create-user");
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
    const { email, password } = req.body;
    const emailLC = email.toLowerCase();
    const user = await User.findOne({ email: emailLC });
    if (!user) {
        return res.status(401).json({ success: false, message: "User not found with given email" });
    }
    try {
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Email / password does not match" });
        } else {
            const responseData = {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                points: user.points,
            };
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            res.json({ success: true, user: responseData, token });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = login;