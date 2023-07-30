const express = require("express");
const reelRouter = express.Router();

const { reel, restaurant, hotel, activity } = require("../models/index");

const bearerAuth = require("../auth/middleware/bearer");
const acl = require("../auth/middleware/acl");

const multer =require('multer');
const firebase=require('firebase/app');
const {getStorage,ref,uploadBytes,getDownloadURL}=require("firebase/storage")
const firebaseConfig = {
    apiKey: "AIzaSyCqtdtPoRTa7HN-wFy68qOdt6vN60CoUks",
    authDomain: "laith-5d196.firebaseapp.com",
    projectId: "laith-5d196",
    storageBucket: "laith-5d196.appspot.com",
    messagingSenderId: "172459670098",
    appId: "1:172459670098:web:c72f5d5cd20e370f617d8b",
    measurementId: "G-NYS7QF36SC"
  };
firebase.initializeApp(firebaseConfig);
const storage=getStorage();
const upload =multer({storage:multer.memoryStorage()})

reelRouter.get("/reels", bearerAuth, acl('readUser'), getAllReels);
//reelRouter.post("/reels", bearerAuth, acl('createUser'), addReels);
//reelRouter.delete("/reels/:id", bearerAuth, acl('deleteUser'), deleteReels);
reelRouter.get("/reelsRestaurant/:id", bearerAuth, acl('readUser'), getReelsRest);
reelRouter.get("/reelsHotel/:id", bearerAuth, acl('readUser'), getReelsHotel);
reelRouter.get("/reelsActivity/:id", bearerAuth, acl('readUser'), getReelActivity);


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
reelRouter.post('/reelsUpload',bearerAuth, acl('createUser'),upload.single("video"), (req,res)=>{
    if(!req.file){
        res.status(400).send("No files uploaded")
        return;
    }
    //let reelRecord = await reel.create(reelData);
    //res.status(201).json(reelRecord);
    const StorageRef=ref(storage,req.file.originalname);
    const metadata={
        contentType:'video/mp4'
    };
    uploadBytes(StorageRef,req.file.buffer,metadata)
    .then(()=>{
        getDownloadURL(StorageRef).then(async url=>{
            let reelData = req.body;
            reelData.url=url
            reelData.userId = req.user.id; 
// console.log(req)
            let reelRecord = await reel.create(reelData);
            res.status(201).json(reelRecord);

            //res.send({url})
        })
        .catch(err=>{
            res.status(500).send(err)
        })
    })
})

async function addReels(req, res) {

}

async function deleteReels(req, res) {
    let id = parseInt(req.params.id);
    let reelRecord = await reel.delete(id);
    res.status(204).json(reelRecord);
}

module.exports = reelRouter;