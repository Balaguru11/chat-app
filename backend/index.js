require("dotenv").config();
const express = require("express");
const app = express();
const { connect } = require("./config/dbConfig");
const { saveMessages, getMessages } = require("./services/saveMessages");
const { leaveRoom, joinRoom } = require("./services/roomService");
const verifyToken = require("./middlewares/verifyToken");
const http = require("http");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
// const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const sessionMiddleware = session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// });

// app.use(sessionMiddleware);

connect();

const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

//routes and controllers
app.use("/auth", require("./routes/authRoute"));
app.use("/safe/user", require("./routes/secure/userRoute"));
app.use(verifyToken);
app.use("/safe/chat", require("./routes/secure/chatRoute"));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = jwt.verify(token, process.env.TOKEN_KEY);
    socket.userId = payload.id;
    socket.username = payload.username;
    next();
  } catch (err) {}
});

const CHAT_BOT = "Chatbot";
let chatRoom = "";
let allUsers = [];

io.on("connection", (socket) => {
  console.log(`User connected. ${socket.id}`);
  socket.on("join_room", (data) => {
    //data will be sent from client which will be having user and room Details;
    const { userId, username, room } = data; // destructuring the data
    socket.join(room);
    joinRoom(userId, room).then((res) => {
      if (res) {
        let joinTime = Date.now();
        socket.to(room).emit("receive_message", {
          message: `${username} has joined the chat room`,
          username: CHAT_BOT,
          joinTime,
        });
      }
      // Send message to all user in the room expect the one who joining now (Say: Bala joined the chat room)
    });

    // save New user to the Chatroom
    chatRoom = room;
    // allUsers = [...allUsers, { id: socket.id, username, room }];
    allUsers.push({ id: socket.id, userId: userId, username, room });
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
    const { message, userId, room, sendTime } = data;

    // io.to(room).emit("receive_message", data);
    //this sends the msg to all users in room including the sender

    //save message in db
    saveMessages(message, userId, room, sendTime)
      .then((res) => {
        console.log("message sent and saved", res);
        io.to(room).emit("receive_message", data);
        // socket.emit("send_status", { message, status: "sent" });
      })
      .catch((err) => console.log(err));
  });

  socket.on("leave_chatroom", (data) => {
    const { userId, username, room } = data;
    socket.leave(room);

    //update the chatroom userschatting

    const leftTime = Date.now();
    allUsers = leaveRoom(userId, allUsers, room);
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
    err,
  });
});

const PORT = process.env.PORT || 8099;

server.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`);
});
