require("dotenv").config();
const express = require("express");
const app = express();
const { connect } = require("./config/dbConfig");
const { saveMessages, getMessages } = require("./services/saveMessages");
const { leaveRoom } = require("./services/roomService");
const verifyToken = require("./middlewares/verifyToken");
const http = require("http");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect();

const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const CHAT_BOT = "Chatbot";
let chatRoom = "";
let allUsers = [];

//routes and controllers
app.use("/auth", require("./routes/authRoute"));
app.use(verifyToken);
app.use("/safe/user", require("./routes/secure/userRoute"));
app.use("/safe/chat", require("./routes/secure/chatRoute"));

io.use((socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = jwt.verify(token, process.env.TOKEN_KEY);
    socket.userId = payload.id;
    socket.username = payload.username;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log(`User connected. ${socket.id}`);

  socket.on("join_room", (data) => {
    //data will be sent from client which will be having user and room Details;
    const { username, room } = data; // destructuring the data
    socket.join(room);

    // Send message to all user in the room expect the one who joining now (Say: Bala joined the chat room)
    let joinTime = Date.now();
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      joinTime,
    });

    // save New user to the Chatroom
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    let chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);

    // Get last 100 messages sent in the chat room
    getMessages(room)
      .then((messages) => {
        socket.emit("last_100_messages", messages);
      })
      .catch((err) => console.log(err));
  });

  socket.on("send_message", (data) => {
    const { message, username, room, sendTime } = data;
    io.to(room).emit("receive_message", data); //this sends the msg to all users in room including the sender

    //save message in db
    saveMessages(message, username, room, sendTime)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  });

  socket.on("leave_chatroom", (data) => {
    const { username, room } = data;
    socket.leave(room);
    const leftTime = Date.now();

    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      username: CHAT_BOT,
      message: `${username} has left the chatroom`,
      leftTime,
    });
    console.log(`${username} has left the chat`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from the chat");
    const user = allUsers.find((user) => user.id === socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("receive_message", {
        message: `${user.username} has disconnected from the chat.`,
      });
    }
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const PORT = process.env.PORT || 8099;

server.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
