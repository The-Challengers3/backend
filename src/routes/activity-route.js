const express = require("express");
const activityRouter = express.Router();

const { activity } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

activityRouter.get("/activity", bearerAuth, acl('readUser'), getactivity);
activityRouter.get("/activity/:id", bearerAuth, acl('readUser'), getOneactivity);
activityRouter.post("/activity", bearerAuth, acl('createOwner'), createactivity);
//activityRouter.put("/activity/:id", bearerAuth, acl('updateOwner'), updateactivity);
//activityRouter.delete("/activity/:id", bearerAuth, acl('delete'), deleteactivity);
activityRouter.get("/owneractivity/:id", bearerAuth, acl('readOwner'), getUseractivity);

async function getactivity(req, res) {
  let activityRecord = await activity.get();
  res.status(200).json(activityRecord);
}
async function getOneactivity(req, res) {
  let id = parseInt(req.params.id);
  let activityRecord = await activity.get(id);
  res.status(200).json(activityRecord);
}
async function createactivity(req, res) {
  let activityData = req.body;
  activityData.ownerId = req.user.id; 

  let activityRecord = await activity.create(activityData);
  res.status(201).json(activityRecord);
}
async function updateactivity(req, res) {
  let id = parseInt(req.params.id);
  let activityData = req.body;
  let activityRecord = await activity.update(id, activityData);
  res.status(201).json(activityRecord);
}
async function deleteactivity(req, res) {
  let id = parseInt(req.params.id);
  let activityRecord = await activity.delete(id);
  res.status(204).json(activityRecord);
}

async function getUseractivity(req, res) {
  let id = parseInt(req.params.id);
  const favs = await userCollection.readHasMany(id, activity.model);
  res.status(200).json(favs);
}

module.exports = activityRouter;
