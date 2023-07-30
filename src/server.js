"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const app = express();
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const authRouter = require('./auth/routes')
const restRouter = require('./routes/restaurants-route');
const activityRouter = require('./routes/activity-route');
const hotelRouter = require('./routes/hotel-route');
const favsRouter = require('./routes/favorite-route');
const bookingRouter = require('./routes/booking-route');
const reelRouter = require('./routes/reel-route');
const commentRouter = require('./routes/comment-route');


app.use(express.static(path.join(__dirname, "public")));

// Handle the root URL
app.post("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "client.html"));
});

// const errorHandler = require('./error-handlers/500.js');
// const notFound = require('./error-handlers/404.js');
app.use(cors());
app.use(express.json());

// App Level MW
app.use(cors());
app.use(morgan('dev'));

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
    res.status(200).send('Welcome to the API!')
});

// Catchalls
// app.use('*', notFound);
// app.use(errorHandler);
//--------------socket--------------------
// app.use(express.static("public"));


let bookings = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room, userType) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    socket.userType = userType;
    if (userType === "owner") {
      socket.emit("allBookings", bookings); // Send existing bookings to the owner
    }
  });

  socket.on("booking", (room, booking) => {
    booking.id = generateId();
    booking.confirmed = false;
    booking.clientSocketId = socket.id;
    bookings.push(booking);

    if (socket.userType === "owner") {
      io.to(room).emit("newBooking", booking);
    }
  });

  socket.on("confirmBooking", (room, bookingId) => {
    bookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        booking.confirmed = true;
        // Notify the client
        // io.to(booking.clientSocketId).emit("bookingConfirmed", bookingId);
        io.emit("bookingConfirmed", bookingId);


      }
      return booking;
    });
  });

  

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = {
    server: server,
    start: (port) => {
        server.listen(port, () => {
            console.log(`Server Up on ${port}`);
        });
    },
};
