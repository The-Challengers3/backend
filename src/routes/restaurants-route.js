const express = require("express");
const restRouter = express.Router();
const path = require("path");


const { restaurant } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

restRouter.get("/restaurants", getrestaurant);
restRouter.get("/restaurants/:id", bearerAuth, acl('readUser'), getOnerestaurant);
restRouter.post("/restaurants", createrestaurant);
restRouter.put("/restaurants/:id", bearerAuth, acl('updateOwner'), updaterestaurant);

restRouter.delete("/restaurants/:id", bearerAuth, acl('delete'), deleterestaurant);

restRouter.get("/ownerRest/:id", bearerAuth, acl('readOwner'), getUserRest);

// restRouter.get("/restaurants", bearerAuth, acl('readUser'), getrestaurant);
// restRouter.get("/restaurants/:id", bearerAuth, acl('readUser'), getOnerestaurant);
// restRouter.post("/restaurants", bearerAuth, acl('createOwner'), createrestaurant);
// restRouter.put("/restaurants/:id", bearerAuth, acl('updateOwner'), updaterestaurant);

// restRouter.delete("/restaurants/:id", bearerAuth, acl('delete'), deleterestaurant);

// restRouter.get("/ownerRest/:id", bearerAuth, acl('readOwner'), getUserRest);

async function getrestaurant(req, res) {
  let restaurantRecord = await restaurant.get();
  // res.sendFile(path.join(__dirname, '..', 'public', 'client.html'));
  res.status(200).json(restaurantRecord);
}
async function getOnerestaurant(req, res) {
  let id = parseInt(req.params.id);
  let restaurantRecord = await restaurant.get(id);
  res.status(200).json(restaurantRecord);
}
async function createrestaurant(req, res) {
  let restaurantData = req.body;
  restaurantData.ownerId = 1;

  let restaurantRecord = await restaurant.create(restaurantData);
  res.status(201).json(restaurantRecord);

}
async function updaterestaurant(req, res) {
  let id = parseInt(req.params.id);
  let restaurantData = req.body;
  let restData = await restaurant.get(id)
  if (restData.ownerId == req.user.id) {
    let restaurantRecord = await restaurant.update(id, restaurantData);
    res.status(201).json(restaurantRecord);
  }
  res.json("you can't update this restaurant")

}
async function deleterestaurant(req, res) {

  let id = parseInt(req.params.id);
  //let restData= await restaurant.get(id)
  //if(restData.userId==req.user.id){
  let restaurantRecord = await restaurant.delete(id);
  res.status(204).json(restaurantRecord);

  //}
  //res.json("you can't delete this restaurant")


}

async function getUserRest(req, res) {
  let id = parseInt(req.params.id);
  const favs = await userCollection.readHasMany(id, restaurant.model);
  res.status(200).json(favs);
}

module.exports = restRouter;
