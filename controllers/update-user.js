const User = require('../models/create-user');

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: "Request body cannot be empty" });
      }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
};

module.exports = updateUser;