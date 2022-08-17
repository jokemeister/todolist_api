const knex = require('../db_knex');
const dbSql = require('../db_sql');

module.exports = {
  async findAll() {
    let tasks = await dbSql.query(`
      SELECT * 
      FROM tasks
    `);
    return tasks.rows;
  },

  async findByListId(listId, all) {
    let tasks;
    
    if (all) {
      tasks = await knex('tasks')
      .select('name', 'description', 'done', 'due_date')
      .where('list_id', listId)
    }
    else {
      tasks = await knex('tasks')
      .select('name', 'description', 'done', 'due_date')
      .where('list_id', listId)
      .andWhere('done', false)
    }

    return tasks;
  },

  async findOneById(taskId) {
    let task = await dbSql.query(`SELECT * FROM tasks WHERE id=$1`, [taskId]);
    return task.rows;
  },

  async findDashboard() {
    let todayTasksCount = await knex('tasks')
      .count({today: 'done'})
      .whereRaw("due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")

    let groupedTasks = await knex
      .select('l.id as id', 'l.name')
      .count({undone: 'done'})
      .from(function() {
        this.select('*')
        .from('tasks')
        .where('done', '=', false)
        .as('t')
      })
      .rightJoin('lists as l', 't.list_id', 'l.id' )
      .groupBy('l.id', 'l.name')
      .orderBy('l.id')

    const result = Object.assign(
      todayTasksCount[0], {'lists': groupedTasks}
    );

    return result;
  },

  async findToday() {
    let todayTasks = await knex('tasks')
      .select('tasks.id as id', 'tasks.name as name', 'description', 'done', 'due_date', 'lists.name as list_name', 'lists.id as list_id')
      .whereRaw("due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")
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
  }
}