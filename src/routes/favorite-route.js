const express = require("express");
const favsRouter = express.Router();

const { favs } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

favsRouter.get("/favorite/:id", bearerAuth, acl('read'), getfavorite);
favsRouter.post("/favorite", bearerAuth, acl('read'), addfavorite);
favsRouter.delete("/favorite/:id", bearerAuth, acl('read'), deletefavorite);

async function getfavorite(req, res) {
    let id = parseInt(req.params.id);
    const fav = await userCollection.readHasMany(id, favs.model);
    res.status(200).json(fav);
}

async function addfavorite(req, res) {
    let favsData = req.body;
    let favsRecord = await favs.create(favsData);
    res.status(201).json(favsRecord);
}

async function deletefavorite(req, res) {
    let id = parseInt(req.params.id);
    let favsRecord = await favs.delete(id);
    res.status(204).json(favsRecord);
}

module.exports = favsRouter;