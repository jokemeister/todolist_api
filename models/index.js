const sequelize = require('../db_sequelize')
const { DataTypes } = require('sequelize');

const List = sequelize.define('lists', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING
}, {
  timestamps: false
});


const Task = sequelize.define('tasks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  due_date: DataTypes.DATE,
  list_id: {
    type: DataTypes.INTEGER,
    foreignKey: true
  }
}, {
  timestamps: false
});

Task.belongsTo(List, {
  foreignKey: 'list_id'
});

List.hasMany(Task, {
  foreignKey: 'id',
  onDelete: 'cascade'
});

Task.sync({alter: true});
List.sync({alter: true});

module.exports = {Task, List}