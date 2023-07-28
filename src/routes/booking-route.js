const express = require("express");
const bookingRouter = express.Router();

const { booking, restaurant, hotel, activity } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

bookingRouter.get("/bookingRest/:id", bearerAuth, acl('read'), getbookingRest);
bookingRouter.get("/bookingHotel/:id", bearerAuth, acl('read'), getbookingHotel);
bookingRouter.get("/bookingActivity/:id", bearerAuth, acl('read'), getbookingActivity);
bookingRouter.get("/bookings/:id", bearerAuth, acl('read'), getbookings);
bookingRouter.post("/booking", bearerAuth, acl('read'), addbooking);
bookingRouter.delete("/booking/:id", bearerAuth, acl('read'), deletebooking);

async function getbookingRest(req, res) {
    let id = parseInt(req.params.id);
    const bookings = await restaurant.readHasMany(id, booking.model);
    res.status(200).json(bookings);
}

async function getbookingHotel(req, res) {
    let id = parseInt(req.params.id);
    const bookings = await hotel.readHasMany(id, booking.model);
    res.status(200).json(bookings);
}

async function getbookingActivity(req, res) {
    let id = parseInt(req.params.id);
    const bookings = await activity.readHasMany(id, booking.model);
    res.status(200).json(bookings);
}

async function getbookings(req, res) {
    let id = parseInt(req.params.id);
    const bookings = await userCollection.readHasMany(id, booking.model);
    res.status(200).json(bookings);
}

async function addbooking(req, res) {
    let bookingData = req.body;
    let bookingRecord = await booking.create(bookingData);
    res.status(201).json(bookingRecord);
}

async function deletebooking(req, res) {
    let id = parseInt(req.params.id);
    let bookingRecord = await booking.delete(id);
    res.status(204).json(bookingRecord);
}

module.exports = bookingRouter;