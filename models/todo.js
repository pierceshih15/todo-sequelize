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

  const Todo = sequelize.define('Todo', {
    name: DataTypes.STRING,
    done: DataTypes.BOOLEAN,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id"
      }
    }
  }, {});
  Todo.associate = function (models) {
    // associations can be defined here
    Todo.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Todo;
};