'use strict';

const userModel = require('../auth/models/users.js');
const { Sequelize, DataTypes } = require('sequelize');
const restModel = require('./Restaurants/model.js');
const favModel = require('./favoriteRestaurants/model.js');
const Collection = require('./collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const sequelize = new Sequelize(DATABASE_URL);
const user = userModel(sequelize, DataTypes);
const restaurant = restModel(sequelize, DataTypes);
const favRest = favModel(sequelize, DataTypes);

const restaurantCollection = new Collection(restaurant);
const favRestCollection = new Collection(favRest);
const userCollection = new Collection(user);


user.hasMany(favRest, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
favRest.belongsTo(user, {
  foreignKey: 'userId',
  targetKey: 'id',
});

user.hasMany(restaurant, {
  foreignKey: 'ownerId',
  sourceKey: 'id',
});
restaurant.belongsTo(user, {
  foreignKey: 'ownerId',
  targetKey: 'id',
});

module.exports = {
  db: sequelize,
  userCollection: userCollection,
  users: user,
  restaurant: restaurantCollection,
  favRest: favRestCollection,
}
