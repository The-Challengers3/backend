"use strict";

const restModel = (sequelize, DataTypes) =>
  sequelize.define("restaurant", {
    name: { type: DataTypes.STRING },
    img: { type: DataTypes.STRING },
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

  }, { timestamps: true }
  );

module.exports = restModel;
