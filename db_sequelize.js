require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres'
});

// async function createLists() {
//   console.log('checkListModel', List === sequelize.models.List);
//   await List.sync({ force: true });
//   const life_tasks = await List.create({ name: "shitty_tasks" });
//   console.log('cccheckList', life_tasks instanceof List);
//   console.log('cccheckList', life_tasks.toJSON());
//   life_tasks.name = 'life_tasks';
//   await life_tasks.save();
//   console.log('cccheckList', life_tasks.toJSON())
// }

// async function createTasks() {
//   console.log('checkTaskModel', Task === sequelize.models.Task);
//   await Task.sync({ force: true });
//   const first_task = await Task.create({ name: "Graduate from school", description: "Stop wasting time on gaining knowledge you will not use", });
//   console.log('cccheckTask', first_task instanceof Task);
//   console.log('cccheckTask', first_task.toJSON());
//   first_task.update({
//     done: true,
//     due_date: '2020-08-01',
//     list_id: 1
//   });
//   console.log('cccheckTask', first_task.toJSON())
// }

// createLists();
// createTasks();

module.exports = sequelize;