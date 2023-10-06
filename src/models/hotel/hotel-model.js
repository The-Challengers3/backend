"use strict";

const hotelModel = (sequelize, DataTypes) =>
  sequelize.define("hotel", {
    name: { type: DataTypes.STRING },
    img: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT },
    price: { type: DataTypes.STRING },
    ownerId: { type: DataTypes.INTEGER },
    long: {
      type: DataTypes.FLOAT,
      required: true,
    },
    lat: {
      type: DataTypes.FLOAT,
      required: true,
    },
  });

module.exports = hotelModel;
