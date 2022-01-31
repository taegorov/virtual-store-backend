'use strict';

module.exports = (sequelize, DataTypes) => {

  return sequelize.define('Ratings', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })
}
