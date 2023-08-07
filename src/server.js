"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc")
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const io = socketIO(server);

// const { Server } = require("socket.io");

// const io = new Server(server);

const authRouter = require('./auth/routes')
const restRouter = require('./routes/restaurants-route');
const activityRouter = require('./routes/activity-route');
const hotelRouter = require('./routes/hotel-route');
const favsRouter = require('./routes/favorite-route');
const bookingRouter = require('./routes/booking-route');
const reelRouter = require('./routes/reel-route');
const commentRouter = require('./routes/comment-route');
// const Pinsrouter = require('./routes/pins');

const uuid = require('uuid').v4;
const queue = {
  notifications: {

  }
}

// app.use(express.static(path.join(__dirname, "public")));

// // Handle the root URL
// app.post("/test", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "client.html"));
// });

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
// app.use(Pinsrouter);

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


// let bookings = [];

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("joinRoom", (room, userType) => {
//     socket.join(room);
//     console.log(`User ${socket.id} joined room ${room}`);
//     socket.userType = userType;
//     if (userType === "owner") {
//       socket.emit("allBookings", bookings); // Send existing bookings to the owner
//     }
//   });

//   socket.on("booking", (room, booking) => {
//     booking.id = generateId();
//     booking.confirmed = false;
//     booking.clientSocketId = socket.id;
//     bookings.push(booking);

//     if (socket.userType === "owner") {
//       io.to(room).emit("newBooking", booking);
//     }
//   });

//   socket.on("confirmBooking", (room, bookingId) => {
//     bookings = bookings.map((booking) => {
//       if (booking.id === bookingId) {
//         booking.confirmed = true;
//         // Notify the client
//         // io.to(booking.clientSocketId).emit("bookingConfirmed", bookingId);
//         io.emit("bookingConfirmed", bookingId);


//       }
//       return booking;
//     });
//   });



//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// function generateId() {
//   return Math.random().toString(36).substr(2, 9);
// }

let onlineUsers = [];

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
  console.log("new connection")
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    console.log('=======>', username)
    console.log(onlineUsers)
  });

  // socket.on("join_room", (data) => {
  //   socket.join(data);
  //   console.log(`User with ID: ${socket.id} joined room: ${data}`);
  // });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });


  socket.on("send_roomId", (userRoomId) => {
    socket.join(userRoomId);
    console.log(`User with ID: ${socket.id} joined room: ${userRoomId}`);
  })

  socket.on("sendNotification", ({ senderName, receiverName, roomId }) => {
    const receiver = getUser(receiverName);

    const id = uuid();
    queue.notifications[id] = senderName;
    console.log(queue.notifications)
    if (receiver) {

      io.to(receiver.socketId).emit("getNotification", {

        senderName,
        roomId,
      });
    } else {
      console.log(`Receiver '${receiverName}' not found.`);

    }
  }); socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('get-all', () => {
    Object.keys(queue.notifications).forEach((id) => {
      socket.emit('new-notifications-msg', {
        id: id,
        Details: queue.notifications[id]
      })

    })
    console.log(11111111111)
  })
  socket.on('received', (payload) => {
    console.log('msgQueue v1', payload.Details)
    delete queue.notifications[payload.id];
    console.log('msgQueue v2', queue.notifications)

  })


  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("disconnect")

  });
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:3005",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

module.exports = {
  server: server,
  start: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
