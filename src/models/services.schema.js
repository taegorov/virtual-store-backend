'use strict';

module.exports = (sequelize, DataTypes) => {

  // defining the column data
  return sequelize.define('Services', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    freelancer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Misc',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    }
  })
}
