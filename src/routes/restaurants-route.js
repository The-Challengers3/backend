const express = require("express");
const restRouter = express.Router();

const { restaurant } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

restRouter.get("/restaurants", bearerAuth, acl('read'), getrestaurant);
restRouter.get("/restaurants/:id", bearerAuth, acl('read'), getOnerestaurant);
restRouter.post("/restaurants", bearerAuth, acl('create'), createrestaurant);
restRouter.put("/restaurants/:id", bearerAuth, acl('update'), updaterestaurant);
restRouter.delete("/restaurants/:id", bearerAuth, acl('delete'), deleterestaurant);
restRouter.get("/ownerRest/:id", bearerAuth, acl('read'), getUserRest);

async function getrestaurant(req, res) {
  let restaurantRecord = await restaurant.get();
  res.status(200).json(restaurantRecord);
}
async function getOnerestaurant(req, res) {
  let id = parseInt(req.params.id);
  let restaurantRecord = await restaurant.get(id);
  res.status(200).json(restaurantRecord);
}
async function createrestaurant(req, res) {
  let restaurantData = req.body;
  let restaurantRecord = await restaurant.create(restaurantData);
  res.status(201).json(restaurantRecord);
}
async function updaterestaurant(req, res) {
  let id = parseInt(req.params.id);
  let restaurantData = req.body;
  let restaurantRecord = await restaurant.update(id, restaurantData);
  res.status(201).json(restaurantRecord);
}
async function deleterestaurant(req, res) {
  let id = parseInt(req.params.id);
  let restaurantRecord = await restaurant.delete(id);
  res.status(204).json(restaurantRecord);
}

async function getUserRest(req, res) {
  let id = parseInt(req.params.id);
  const favs = await userCollection.readHasMany(id, restaurant.model);
  res.status(200).json(favs);
}

module.exports = restRouter;
