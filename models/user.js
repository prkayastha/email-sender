'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastSignIn: {
      allowNull: true,
      type: DataTypes.DATE
    },
    deleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    active: { 
      allowNull: false, 
      type: DataTypes.BOOLEAN 
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};