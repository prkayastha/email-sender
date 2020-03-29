'use strict';
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    role: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    version: false
  });
  Roles.associate = function(models) {
    // associations can be defined here
    models.Roles.belongsToMany(models.Users, {through: 'UserRole'});
  };
  return Roles;
};