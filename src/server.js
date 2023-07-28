"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const app = express();
const authRouter = require('./auth/routes')
const restRouter = require('./routes/restaurants-route');
const activityRouter = require('./routes/activity-route');
const hotelRouter = require('./routes/hotel-route');
const favsRouter = require('./routes/favorite-route');
const bookingRouter = require('./routes/booking-route');
const reelRouter = require('./routes/reel-route');
const commentRouter = require('./routes/comment-route');

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

module.exports = {
    app: app,
    start: (port) => {
        app.listen(port, () => {
            console.log(`Server Up on ${port}`);
        });
    },
};
