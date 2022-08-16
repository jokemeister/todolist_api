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
    let allTasks = await knex('tasks')
    .count('*', {as: 'today'})
    .whereRaw("due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")

    let groupedTasks = await knex('tasks')
    .groupBy('lists.name')
    .select(knex.raw('list_id as id, lists.name, COUNT(*) as undone'))
    .groupBy('list_id')
    .rightOuterJoin('lists', function() {
      this.on('lists.id', '=', 'tasks.list_id')
    })
    .whereRaw("due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")
    .orderBy('id')
 

    await Promise.all([allTasks[0], allTasks[0]['lists']=groupedTasks])
    return allTasks[0]

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
  }
}