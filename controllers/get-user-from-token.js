const User = require('../models/create-user');
const jwt = require("jsonwebtoken");

const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userIdFromToken = decodedToken.userId;
        const user = await User.findById(userIdFromToken)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error retrieving profile' });
    }
};

module.exports = getUserProfile;