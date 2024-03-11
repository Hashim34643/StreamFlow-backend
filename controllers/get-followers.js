const User = require("../models/create-user");

const getUserFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        const userWithFollowers = await User.findById(userId, 'followers').exec();

        if (!userWithFollowers) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const followersDetails = await Promise.all(
            userWithFollowers.followers.map(async (followerId) => {
                return User.findById(followerId, 'username firstName lastName avatar').exec();
            })
        );

        res.status(200).json({ success: true, followers: followersDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving user followers" });
    }
};

module.exports = getUserFollowers;