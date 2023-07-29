const express = require("express");
const favsRouter = express.Router();

const { favs } = require("../models/index");
const { userCollection } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

favsRouter.get("/favorite/:id", bearerAuth, acl('readUser'), getfavorite);
favsRouter.post("/favorite", bearerAuth, acl('createUser'), addfavorite);
favsRouter.delete("/favorite/:id", bearerAuth, acl('deleteUser'), deletefavorite);

async function getfavorite(req, res) {
    let id = parseInt(req.params.id);
    const fav = await userCollection.readHasMany(id, favs.model);
    res.status(200).json(fav);
}

async function addfavorite(req, res) {
    let favsData = req.body;
    favsData.userId = req.user.id; 

    let favsRecord = await favs.create(favsData);
    res.status(201).json(favsRecord);
}

async function deletefavorite(req, res) {
    let id = parseInt(req.params.id);
    let favsRecord = await favs.delete(id);
    res.status(204).json(favsRecord);
}

module.exports = favsRouter;