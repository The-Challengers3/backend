const express = require("express");
const restRouter = express.Router();

const { hotel } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

restRouter.get("/hotel", bearerAuth, acl('readUser'), gethotel);
restRouter.get("/hotel/:id", bearerAuth, acl('readUser'), getOnehotel);
restRouter.post("/hotel", bearerAuth, acl('createOwner'), createhotel);
restRouter.put("/hotel/:id", bearerAuth, acl('updateOwner'), updatehotel);
restRouter.delete("/hotel/:id", bearerAuth, acl('delete'), deletehotel);
restRouter.get("/ownerHotel/:id", bearerAuth, acl('readOwner'), getUserHotel);

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
  hotelData.ownerId = req.user.id;

  let hotelRecord = await hotel.create(hotelData);
  res.status(201).json(hotelRecord);
}
async function updatehotel(req, res) {
  let id = parseInt(req.params.id);

  let hotelData = req.body;
  let updateData = await hotel.get(id)
  if (updateData.ownerId == req.user.id) {
    let hotelRecord = await hotel.update(id, hotelData);
    res.status(201).json(hotelRecord);
  }
  res.json("you can't update this hotel")

  }
  async function deletehotel(req, res) {
    let id = parseInt(req.params.id);
    // let hotelsData = await hotel.get(id)
    // if (hotelsData.userId == req.user.id) {
      let hotelRecord = await hotel.delete(id);
      res.status(204).json(hotelRecord);
    // }
    // res.json("you can't delete this hotel")

  }

  async function getUserHotel(req, res) {
    let id = parseInt(req.params.id);
    const favs = await userCollection.readHasMany(id, hotel.model);
    res.status(200).json(favs);
  }

  module.exports = restRouter;
