"use strict";

const activityModel = (sequelize, DataTypes) =>
  sequelize.define("activity", {

    name: { type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT},
    location: { type: DataTypes.STRING},
    rating: { type: DataTypes.FLOAT },
    price: { type: DataTypes.STRING },
    ownerId: { type: DataTypes.INTEGER },
  });

module.exports = activityModel;
