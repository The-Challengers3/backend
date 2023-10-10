"use strict";
require("dotenv").config();
const uuid = require("uuid").v4;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const authRouter = require("./auth/routes");
const restRouter = require("./routes/restaurants-route");
const activityRouter = require("./routes/activity-route");
const hotelRouter = require("./routes/hotel-route");
const favsRouter = require("./routes/favorite-route");
const bookingRouter = require("./routes/booking-route");
const reelRouter = require("./routes/reel-route");
const commentRouter = require("./routes/comment-route");

const errorHandler = require("./error-handlers/500");
const notFound = require("./error-handlers/404.js");
app.use(cors());
app.use(express.json());

// App Level MW
app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(restRouter);
app.use(activityRouter);
app.use(hotelRouter);
app.use(favsRouter);
app.use(bookingRouter);
app.use(reelRouter);
app.use(commentRouter);
app.use(authRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API!");
});

app.use("*", notFound);
app.use(errorHandler);

//--------------socket--------------------

let onlineUsers = [];
let queue = {
  notifications: {},

};
let queue2 = {
  messages: {},

};

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    console.log("=======>", username);
    console.log(onlineUsers);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("send_roomId", (userRoomId) => {
    socket.join(userRoomId);
    console.log(`User with ID: ${socket.id} joined room: ${userRoomId}`);
  });

  socket.on("sendNotification", ({ senderName, receiverName, roomId }) => {
    const receiver = getUser(receiverName);


    console.log(queue.notifications)
    if (receiver) {
      socket.to(receiver.socketId).emit("getNotification", {
        senderName,
        roomId,
      });
    } else {
      console.log(`Receiver '${receiverName}' not found.`);

      const id = uuid();
      queue.notifications[id] = senderName;
    }
  });
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("get-all", () => {
    Object.keys(queue.notifications).forEach((id) => {
      socket.emit("new-notifications-msg", {
        id: id,
        Details: queue.notifications[id],
      });
    });
  });
  socket.on("received", (payload) => {
    console.log("msgQueue v1", payload.Details);
    delete queue.notifications[payload.id];
    console.log("msgQueue v2", queue.notifications);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("disconnect");
  });
});

module.exports = {
  server: server,
  start: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
