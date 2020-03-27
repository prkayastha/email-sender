'use strict';
module.exports = (sequelize, DataTypes) => {
  const Password = sequelize.define('Password', {
    password: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  Password.associate = function(models) {
    // associations can be defined here
  };
  return Password;
};