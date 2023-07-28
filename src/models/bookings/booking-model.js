'use strict';

const bookModel = (sequelize, DataTypes) => sequelize.define('bookings', {
  name: { type: DataTypes.STRING},
  username: { type: DataTypes.STRING},
  img: { type: DataTypes.STRING},
  howmany: { type: DataTypes.INTEGER},
  date: { type: DataTypes.DATE },
  userId: { type: DataTypes.INTEGER},
  restaurantId: { type: DataTypes.INTEGER},
  hotelId: { type: DataTypes.INTEGER},
  activityId: { type: DataTypes.INTEGER},
});

module.exports = bookModel;