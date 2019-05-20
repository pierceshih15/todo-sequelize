'use strict';
module.exports = (sequelize, DataTypes) => {
  // sequelize
  //   .sync({
  //     force: true
  //   })
  //   .then(function (err) {
  //     console.log('It worked!');
  //   }, function (err) {
  //     console.log('An error occurred while creating the table:', err);
  //   });

  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Todo, {
      foreignKey: 'userId'
    });
  };
  return User;
};