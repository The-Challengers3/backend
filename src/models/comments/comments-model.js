"use strict";

const commentModel = (sequelize, DataTypes) =>
  sequelize.define("comment", {
    content: { type: DataTypes.STRING},
    date:{type: DataTypes.STRING},
    userId: { type: DataTypes.INTEGER },
    reelId: { type: DataTypes.INTEGER },
  });

module.exports = commentModel;
