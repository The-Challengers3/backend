'use strict';

const userModel = require('../auth/models/users.js');

const { Sequelize, DataTypes } = require('sequelize');

const restModel = require('./restaurants/restaurants-model.js');
const hotelModel = require('./hotel/hotel-model.js');
const activityModel = require('./activity/activity-model.js');

// const PinsModel = require('./pins/pins.js');

const favModel = require('./favorites/favorite-model.js');
const bookModel = require('./bookings/booking-model.js');

const reelModel = require('./reels/reel-model.js');
const commentModel = require('./comments/comments-model.js');


const Collection = require('./collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const sequelize = new Sequelize(DATABASE_URL, { logging: false });

const user = userModel(sequelize, DataTypes);

const restaurant = restModel(sequelize, DataTypes);
const hotel = hotelModel(sequelize, DataTypes);
const activity = activityModel(sequelize, DataTypes);

const favs = favModel(sequelize, DataTypes);
const booking = bookModel(sequelize, DataTypes);

const reel = reelModel(sequelize, DataTypes);
const comment = commentModel(sequelize, DataTypes);

// const pins = PinsModel(sequelize, DataTypes);



const restaurantCollection = new Collection(restaurant);

// const pinsCollection = new Collection(pins);


const hotelCollection = new Collection(hotel);
const activityCollection = new Collection(activity);

const favsCollection = new Collection(favs);
const bookingCollection = new Collection(booking);

const reelCollection = new Collection(reel);
const commentCollection = new Collection(comment);

const userCollection = new Collection(user);



user.hasMany(restaurant, {
  foreignKey: 'ownerId',
  sourceKey: 'id',
});
restaurant.belongsTo(user, {
  foreignKey: 'ownerId',
  targetKey: 'id',
});

user.hasMany(hotel, {
  foreignKey: 'ownerId',
  sourceKey: 'id',
});
hotel.belongsTo(user, {
  foreignKey: 'ownerId',
  targetKey: 'id',
});

user.hasMany(activity, {
  foreignKey: 'ownerId',
  sourceKey: 'id',
});
activity.belongsTo(user, {
  foreignKey: 'ownerId',
  targetKey: 'id',
});
//----------
user.hasMany(favs, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
favs.belongsTo(user, {
  foreignKey: 'userId',
  targetKey: 'id',
});
user.hasMany(booking, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
booking.belongsTo(user, {
  foreignKey: 'userId',
  targetKey: 'id',
});

//---------
user.hasMany(reel, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
reel.belongsTo(user, {
  foreignKey: 'userId',
  targetKey: 'id',
});
user.hasMany(comment, {
  foreignKey: 'userId',
  sourceKey: 'id',
});
comment.belongsTo(user, {
  foreignKey: 'userId',
  targetKey: 'id',
});
//----------
restaurant.hasMany(reel, {
  foreignKey: 'restaurantId',
  sourceKey: 'id',
});
reel.belongsTo(restaurant, {
  foreignKey: 'restaurantId',
  targetKey: 'id',
});

hotel.hasMany(reel, {
  foreignKey: 'hotelId',
  sourceKey: 'id',
});
reel.belongsTo(hotel, {
  foreignKey: 'hotelId',
  targetKey: 'id',
});

activity.hasMany(reel, {
  foreignKey: 'activityId',
  sourceKey: 'id',
});
reel.belongsTo(activity, {
  foreignKey: 'activityId',
  targetKey: 'id',
});

//---------
reel.hasMany(comment, {
  foreignKey: 'reelId',
  sourceKey: 'id',
});
comment.belongsTo(reel, {
  foreignKey: 'reelId',
  targetKey: 'id',
});

//----------
restaurant.hasMany(booking, {
  foreignKey: 'restaurantId',
  sourceKey: 'id',
});
booking.belongsTo(restaurant, {
  foreignKey: 'restaurantId',
  targetKey: 'id',
});
hotel.hasMany(booking, {
  foreignKey: 'hotelId',
  sourceKey: 'id',
});
booking.belongsTo(hotel, {
  foreignKey: 'hotelId',
  targetKey: 'id',
});

activity.hasMany(booking, {
  foreignKey: 'activityId',
  sourceKey: 'id',
});
booking.belongsTo(activity, {
  foreignKey: 'activityId',
  targetKey: 'id',
});


module.exports = {
  db: sequelize,
  userCollection: userCollection,
  restaurant: restaurantCollection,
  hotel: hotelCollection,
  activity: activityCollection,
  reel: reelCollection,
  comment: commentCollection,
  favs: favsCollection,
  booking: bookingCollection,
  users: user,
  // Pins:pinsCollection,
}
