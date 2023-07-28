const express = require("express");
const restRouter = express.Router();

const { hotel } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

restRouter.get("/hotel", bearerAuth, acl('read'), gethotel);
restRouter.get("/hotel/:id", bearerAuth, acl('read'), getOnehotel);
restRouter.post("/hotel", bearerAuth, acl('create'), createhotel);
restRouter.put("/hotel/:id", bearerAuth, acl('update'), updatehotel);
restRouter.delete("/hotel/:id", bearerAuth, acl('delete'), deletehotel);
restRouter.get("/ownerHotel/:id", bearerAuth, acl('read'), getUserHotel);

async function gethotel(req, res) {
  let hotelRecord = await hotel.get();
  res.status(200).json(hotelRecord);
}
async function getOnehotel(req, res) {
  let id = parseInt(req.params.id);
  let hotelRecord = await hotel.get(id);
  res.status(200).json(hotelRecord);
}
async function createhotel(req, res) {
  let hotelData = req.body;
  let hotelRecord = await hotel.create(hotelData);
  res.status(201).json(hotelRecord);
}
async function updatehotel(req, res) {
  let id = parseInt(req.params.id);
  let hotelData = req.body;
  let hotelRecord = await hotel.update(id, hotelData);
  res.status(201).json(hotelRecord);
}
async function deletehotel(req, res) {
  let id = parseInt(req.params.id);
  let hotelRecord = await hotel.delete(id);
  res.status(204).json(hotelRecord);
}

async function getUserHotel(req, res) {
  let id = parseInt(req.params.id);
  const favs = await userCollection.readHasMany(id, hotel.model);
  res.status(200).json(favs);
}

module.exports = restRouter;
