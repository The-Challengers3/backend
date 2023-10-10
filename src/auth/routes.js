'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('../models/index');
const basicAuth = require('./middleware/basic.js')

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

authRouter.post('/signup', async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(userRecord);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(req.user);
});

authRouter.get("/allusers", bearerAuth, acl("read"), getAllUsers);
async function getAllUsers(req, res) {
  const allusers = await users.findAll();
  res.status(200).json(allusers);
}


authRouter.get("/oneuser/:id", bearerAuth, acl("readUser"), getOneUsers);
async function getOneUsers(req, res) {
  let id = parseInt(req.params.id);
  const user = await users.findOne({ where: { id: id } });
  res.status(200).json({ username: user.username, image: user.image });
}

module.exports = authRouter;
