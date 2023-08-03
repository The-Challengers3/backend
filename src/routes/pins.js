const Pinsrouter = require("express").Router();
const {Pins} = require("../models/index");

//create a pin

Pinsrouter.post("/pins", async (req, res) => {
  const pinData = req.body;
  try {
    const newPin = await Pins.create(pinData)
    res.status(200).json(newPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
Pinsrouter.get("/pins", async (req, res) => {
  try {
    const pins = await Pins.get();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = Pinsrouter;