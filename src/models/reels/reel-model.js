"use strict";

const reelModel = (sequelize, DataTypes) =>
  sequelize.define("reel", {
    username: { type: DataTypes.STRING},
    url: {type: DataTypes.TEXT},
    description: {type: DataTypes.TEXT},
    rating: { type: DataTypes.FLOAT},
    restaurantId: { type: DataTypes.INTEGER},
    hotelId: { type: DataTypes.INTEGER },
    activityId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER },

  });
module.exports = reelModel;
