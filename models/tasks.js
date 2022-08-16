const dbSql = require('../db_sql');
const sequelize = require('../db_sequelize')
const { DataTypes, Op } = require('sequelize');

const Task = sequelize.define('task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  done: DataTypes.BOOLEAN,
  due_date: DataTypes.DATE,
  list_id: DataTypes.INTEGER,
}, {
  timestamps: false
});

Task.associate = (models) => {
  Task.belongsTo(models.list, {
    foreignKey: 'list_id'
  });
}


module.exports = {
  async findAll() {
    let tasks = await dbSql.query(`
    SELECT * 
    FROM tasks
    `);
    return tasks.rows;
  },

  async findByListId(listId, all) {
    let tasks = await knex('tasks')
    .select('name', 'description', 'done', 'due_date')
    .where('list_id', listId)
    .andWhere('done', all)
    return tasks;
  },


  async findOneById(taskId) {
    let task = await dbSql.query(`SELECT * FROM tasks WHERE id=$1`, [taskId]);
    return task.rows;
  },

  async findDashboard() {
    let allTasks = Task.count(
      {
        where: {
          due_date:{
            [Op.between]: [new Date(), new Date()]
          }
        },
      }
    );

    // let groupedTasks = Task.count(
    //   {
    //     where: {
    //       done: false
    //     },
    //     group: ['list_id'],

    //   }
    // );

    let groupedTasks = Task.findAll(
      {
        include: 'list'
      }
    );

    return groupedTasks;
  },

  async findToday() {
    let todayTasks = await knex('tasks')
    .select(knex.raw('tasks.id as id, tasks.name as name, description, done, due_date, lists.name as list_name, lists.id as list_id'))
    .rightOuterJoin('lists', function() {
      this.on('lists.id', '=', 'tasks.list_id')
    })

    return todayTasks
  },

  async create(task) {
    let newTask = await dbSql.query(`
      INSERT INTO tasks (name, description, done, due_date, list_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `, 
    [task.name, task.description, false, task.due_date, task.list_id]);
    return newTask.rows;
  },

  async replace(taskId, task) {
    let newTask = await dbSql.query(`
    UPDATE tasks 
    SET name = $2, description = $3, done = $4, due_date = $5, list_id = $6 
    WHERE id=$1 RETURNING *
    `, 
    [taskId, task.name, task.description, task.done, task.due_date, task.list_id]);
    return newTask.rows;
  },

  async update(taskId, newValues) {
    const task = (await dbSql.query(`SELECT * FROM tasks WHERE id=$1`, [taskId])).rows[0];
    Object.assign(task, newValues);
    return this.replace(taskId, task)
  },

  async delete(taskId) {
    const task = await dbSql.query(`DELETE FROM tasks WHERE id=$1 RETURNING *`, [taskId]);
    return task.rows;
  },
}