const express = require("express");
const commentRouter = express.Router();

const { comment, reel } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

commentRouter.get("/comments/:id", bearerAuth, acl('readUser'), getAllcomments);
commentRouter.post("/comments", bearerAuth, acl('createUser'), addcomments);
//commentRouter.delete("/comments/:id", bearerAuth, acl('deleteUser'), deletecomments);

async function getAllcomments(req, res) {
    let id = parseInt(req.params.id);
    const commentReel = await reel.readHasMany(id, comment.model);
    res.status(200).json(commentReel);
}

async function addcomments(req, res) {
    let commentData = req.body;
    commentData.userId = req.user.id; 

    let commentRecord = await comment.create(commentData);
    res.status(201).json(commentRecord);
}

async function deletecomments(req, res) {
    let id = parseInt(req.params.id);
    let commentRecord = await comment.delete(id);
    res.status(204).json(commentRecord);
}

module.exports = commentRouter;
