"use strict";

const restModel = (sequelize, DataTypes) =>
  sequelize.define("restaurant", {

    name: { type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT},
    location: { type: DataTypes.STRING},
    rating: { type: DataTypes.FLOAT },
    price: { type: DataTypes.STRING },
    ownerId: { type: DataTypes.INTEGER },
  });

module.exports = restModel;
