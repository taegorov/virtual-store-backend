'use strict';

require('dotenv').config();

// const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory:';
// const DATABASE_URL = 'postgres://postgres@localhost:5432';

// below: throw a !== instead of ===  if you want to connect to ElephantSQL database LOCALLY (instead of local)
// for PRODUCTION, use ===
const DATABASE_URL = process.env.NODE_ENV === 'production' ? process.env.DATABASE_PROD : process.env.DATABASE_DEV

const { Sequelize, DataTypes } = require('sequelize');

const userSchema = require('./user.schema.js');
const servicesSchema = require('./services.schema.js')
const ratingsSchema = require('./ratings.schema.js')


// Heroku needs this to run Sequelize
let sequelize = new Sequelize(DATABASE_URL, {
  // dialectOptions: {
  //   ssl: {
  //     require: false,
  //     rejectUnauthorized: false,
  //   }
  // }
});

const user = userSchema(sequelize, DataTypes);
const services = servicesSchema(sequelize, DataTypes);
const ratings = ratingsSchema(sequelize, DataTypes);


// WRITE THIS OUT IN SQL, then refactor into sequelize
// do we need force: true to get sync to run? look up what this does
// sync({force: true})

user.hasMany(services, { foreignKey: 'freelancer', sourceKey: 'id' });
services.belongsTo(user, { foreignKey: 'freelancer', targetKey: 'id' });

services.hasMany(ratings, { foreignKey: 'service_id', sourceKey: 'id' });
ratings.belongsTo(services, { foreignKey: 'service_id', targetKey: 'id' });

user.hasMany(ratings, { foreignKey: 'user_id', sourceKey: 'id' });
ratings.belongsTo(user, { foreignKey: 'user_id', targetKey: 'id' });


module.exports = {
  db: sequelize,
  user: user,
  services: services,
  ratings: ratings,
}
