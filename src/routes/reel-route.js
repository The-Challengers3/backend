const express = require("express");
const reelRouter = express.Router();

const { reel, restaurant, hotel, activity } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

const multer = require("multer");
const firebase = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENID,
};
firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

reelRouter.get("/reels",  getAllReels);
reelRouter.delete("/reels/:id", bearerAuth, acl("deleteUser"), deleteReels);
reelRouter.get(
  "/reelsRestaurant/:id",
  bearerAuth,
  acl("readUser"),
  getReelsRest
);
reelRouter.get("/reelsHotel/:id", bearerAuth, acl("readUser"), getReelsHotel);
reelRouter.get(
  "/reelsActivity/:id",
  bearerAuth,
  acl("readUser"),
  getReelActivity
);

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

reelRouter.post(
  "/reelsUpload",
  bearerAuth,
  acl("createUser"),
  upload.single("video"),
  (req, res) => {
    if (!req.file) {
      res.status(400).send("No files uploaded");
      return;
    }

    const StorageRef = ref(storage, req.file.originalname);
    const metadata = {
      contentType: "video/mp4",
    };
    uploadBytes(StorageRef, req.file.buffer, metadata).then(() => {
      getDownloadURL(StorageRef)
        .then(async (url) => {
          let reelData = req.body;
          reelData.url = url;
          // reelData.userId = req.user.id;
          let reelRecord = await reel.create(reelData);
          res.status(201).json(reelRecord);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    });
  }
);

async function deleteReels(req, res) {
  let id = parseInt(req.params.id);
  let reelsData = await reel.get(id);
  if (reelsData.userId == req.user.id || req.user.role == 'admin') {
    let reelRecord = await reel.delete(id);
    res.status(204).json(reelRecord);
  }
  // res.json("you can't delete this reel");
}

module.exports = reelRouter;
