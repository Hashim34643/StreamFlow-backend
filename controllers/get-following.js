const User = require("../models/create-user");

const getUserFollowing = async (req, res) => {
    const { userId } = req.params;

    try {
        const userWithFollowing = await User.findById(userId, 'following').exec();

        if (!userWithFollowing) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const followingDetails = await Promise.all(
            userWithFollowing.following.map(async (followerId) => {
                return User.findById(followerId, 'username firstName lastName avatar').exec();
            })
        );

        res.status(200).json({ success: true, following: followingDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving user followers" });
    }
};

module.exports = getUserFollowing;