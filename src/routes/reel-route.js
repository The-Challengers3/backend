const express = require("express");
const reelRouter = express.Router();

const { reel, restaurant, hotel, activity } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

reelRouter.get("/reels", bearerAuth, acl('read'), getAllReels);
reelRouter.post("/reels", bearerAuth, acl('read'), addReels);
reelRouter.delete("/reels/:id", bearerAuth, acl('read'), deleteReels);
reelRouter.get("/reelsRestaurant/:id", bearerAuth, acl('read'), getReelsRest);
reelRouter.get("/reelsHotel/:id", bearerAuth, acl('read'), getReelsHotel);
reelRouter.get("/reelsActivity/:id", bearerAuth, acl('read'), getReelActivity);

async function getAllReels(req, res) {
    let restaurantRecord = await reel.get();
    res.status(200).json(restaurantRecord);
}

async function getReelsRest(req, res) {
    let id = parseInt(req.params.id);
    const restReel = await restaurant.readHasMany(id, reel.model);
    res.status(200).json(restReel);
}

async function getReelsHotel(req, res) {
    let id = parseInt(req.params.id);
    const hotelReel = await hotel.readHasMany(id, reel.model);
    res.status(200).json(hotelReel);
}

async function getReelActivity(req, res) {
    let id = parseInt(req.params.id);
    const ActivityReel = await activity.readHasMany(id, reel.model);
    res.status(200).json(ActivityReel);
}

async function addReels(req, res) {
    let reelData = req.body;
    let reelRecord = await reel.create(reelData);
    res.status(201).json(reelRecord);
}

async function deleteReels(req, res) {
    let id = parseInt(req.params.id);
    let reelRecord = await reel.delete(id);
    res.status(204).json(reelRecord);
}

module.exports = reelRouter;