const dbSql = require('../db_sql');
const sequelize = require('../db_sequelize')
const { Op } = require('sequelize');
const { Task } = require('.');

module.exports = {
  async findAll() {
    let tasks = await dbSql.query(`
      SELECT * 
      FROM tasks
      ORDER BY id
    `);
    return tasks.rows;
  },

  async findByListId(listId, all) {
    let tasks = await dbSql.query(`
      SELECT id, name, description, done, due_date, list_id 
      FROM tasks
      WHERE list_id = $1 AND (done=false OR done=$2)
      ORDER BY id
    `, [listId, all]);
    return tasks.rows;
  },

  async findOneById(taskId) {
    let task = await dbSql.query(`SELECT * FROM tasks WHERE id=$1`, [taskId]);
    return task.rows;
  },

  async findDashboard() {
    let todayTasks = await dbSql.query(`
      SELECT COUNT(*) as today
      FROM tasks
      WHERE due_date < CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'
    `);

    let groupedTasks = await dbSql.query(`
      SELECT l.id as id, l.name, COUNT(t.id) as undone
      FROM (
        SELECT *
        FROM tasks
        WHERE done = false
      ) as t
      RIGHT JOIN lists as l
      ON t.list_id = l.id
      GROUP BY l.id, l.name
      ORDER BY l.id
    `);

    const result = Object.assign(todayTasks.rows[0], {'lists': groupedTasks.rows});
    return result;
  },

  async findToday() {
    let todayTasks = await Task.findAll({
      attributes: ['id', 'name', 'description', 'done', 'due_date'],
      where: {
        due_date: {
          [Op.lte]: sequelize.literal("CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")
        },
        done: false
      },
      order: [['id', 'ASC']],
      include: sequelize.models.lists
    });

    return todayTasks;
  },

  async create(task) {
    if (task.id) delete task.id
    
    let newTask = await Task.create(task)
    return newTask;
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
    if (newValues.id) delete newValues.id 

    await Task.update(newValues, {
      where: {
        id: taskId
      }
    });

    return await Task.findByPk(taskId);
  },

  async delete(taskId) {
    const task = await dbSql.query(`DELETE FROM tasks WHERE id=$1 RETURNING *`, [taskId]);
    return task.rows;
  },
}