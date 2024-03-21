const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
require("./models/db");

const {createUserRouter} = require("./routes/create-user");
const loginRouter = require("./routes/login");
const forgotPasswordRouter = require("./routes/forgot-password");
const resetPasswordRouter = require("./routes/reset-password");
const updateUserRouter = require("./routes/update-user");
const getUserRouter = require("./routes/get-user");
const {followUserRouter} = require("./routes/create-user");
const {unfollowUserRouter} = require("./routes/create-user");
const getUserFollowersRouter = require("./routes/get-followers");
const getUserFollowingRouter = require("./routes/get-following,js");
const deleteAccountRouter = require("./routes/delete-user");
const startStreamRouter = require("./routes/start-stream");
const endStreamRouter = require("./routes/end-stream");
const getStreamByIdRouter = require("./routes/get-stream");
const sendMessageRouter = require("./routes/send-message");
const deleteMessageRouter = require("./routes/delete-message");
const getChatHistoryRouter = require("./routes/get-chat-history");
const getChatMessagesRouter = require("./routes/get-stream-chat");
const enterStreamRouter = require("./routes/user-enters-stream");
const exitStreamRouter = require("./routes/user-exits-stream");
const getStreamsByCategoryRouter = require("./routes/get-stream-by-category");
const searchStreamersRouter = require("./routes/search-user");
const getAllLiveStreamsRouter = require("./routes/get-streams");

const app = express();
app.use(cors());
app.use(express.json());

app.use(createUserRouter);
app.use(loginRouter);
app.use(forgotPasswordRouter);
app.use(resetPasswordRouter);
app.use(updateUserRouter);
app.use(getUserRouter);
app.use(followUserRouter);
app.use(unfollowUserRouter);
app.use(getUserFollowersRouter);
app.use(getUserFollowingRouter);
app.use(deleteAccountRouter);
app.use(startStreamRouter);
app.use(endStreamRouter);
app.use(getStreamByIdRouter);
app.use(sendMessageRouter);
app.use(deleteMessageRouter);
app.use(getChatHistoryRouter);
app.use(getChatMessagesRouter);
app.use(enterStreamRouter);
app.use(exitStreamRouter);
app.use(getStreamsByCategoryRouter);
app.use(searchStreamersRouter);
app.use(getAllLiveStreamsRouter);

const server = app.listen(6954, () => {
  console.log("Port is listening");
});
server.timeout = 60000;

module.exports = server;