"use strict";

const favModel = (sequelize, DataTypes) =>
  sequelize.define("favs", {
    name: { type: DataTypes.STRING},
    img: { type: DataTypes.TEXT},
    description: { type: DataTypes.TEXT},
    location: { type: DataTypes.STRING},
    rating: { type: DataTypes.FLOAT},
    price: { type: DataTypes.STRING},
    userId: { type: DataTypes.INTEGER },
  });

module.exports = favModel;
