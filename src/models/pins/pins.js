"use strict";

const PinsModel = (sequelize, DataTypes) =>
  sequelize.define(
    "pins",
    {
      username: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.FLOAT,
        min: 0,
        max: 5,
      },
      long: {
        type: DataTypes.FLOAT,
        required: true,
      },
      lat: {
        type: DataTypes.FLOAT,
        required: true,
      },
    },
    { timestamps: true }
  );
module.exports = PinsModel;
