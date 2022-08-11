const db = require('../db');
const knex = require('../db')

module.exports = {
  async findAll() {
    let tasks = await knex('tasks').select('*');
    return tasks;
  },

  async findByListId(listId, all) {
    let tasks = await db.query(`
    SELECT name, description, done, due_date 
    FROM tasks
    WHERE list_id = $1 AND (done=false OR done=$2)
    `, [listId, all])
    return tasks.rows;
  },


  async findOneById(taskId) {
    let task = await db.query(`SELECT * FROM tasks WHERE id=$1`, [taskId]);
    return task.rows;
  },

  async findDashboard() {
    let allTasks = await knex('tasks')
    .count('*')
    .whereRaw("due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")
    // let groupedTasks = await db.query(`
    // SELECT name, count
    // FROM (
    //   SELECT list_id, COUNT(*)
    //   FROM (    
    //     SELECT id, list_id, done
    //     FROM tasks 
    //     WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'
    //   ) as todayTable
    //   WHERE done=false
    //   GROUP BY list_id
    // ) as unDoneTodayTable
    // RIGHT JOIN lists
    // ON unDoneTodayTable.list_id = lists.id
    // `)
    // return allTasks.rows.concat(groupedTasks.rows);
    let groupedTasks = await knex('tasks')
    .select('name', 'count')
    .from(function() {
      this.select('id', 'list_id', 'done')
      .from('tasks')
      .whereRaw("due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")
      .as('todayTable')
      .where('done', false)
      .groupBy('list_id')
    })
    .as('unDoneTodayTable')
    .rightOuterJoin('lists', function() {
      this.on('tasks.list_id', '=', 'lists.id')
    })

    return groupedTasks;
  },

  async findToday() {
    let todayTasks = await knex('tasks')
    .select('*')
    .rightOuterJoin('lists', function() {
      this.on('tasks.list_id', '=', 'lists.id')
    })
    .whereRaw("due_date BETWEEN CURRENT_DATE AND CURRENT_DATE::TIMESTAMP + INTERVAL '23:59:59'")
    return todayTasks
  },

  async create(task) {
    let newTask = await db.query(`
      INSERT INTO tasks (name, description, done, due_date, list_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `, 
    [task.name, task.description, false, task.due_date, task.list_id]);
    return newTask.rows;
  },

  async exchange(taskId, task) {
    let newTask = await db.query(`
    UPDATE tasks 
    SET name = $2, description = $3, done = $4, due_date = $5, list_id = $6 
    WHERE id=$1 RETURNING *
    `, 
    [taskId, task.name, task.description, task.done, task.due_date, task.list_id]);
    return newTask.rows;
  },

  async update(taskId, newValues) {
    const task = (await db.query(`SELECT * FROM tasks WHERE id=$1`, [taskId])).rows[0];
    Object.assign(task, newValues);
    console.log(task);
    const updatedTask = await db.query(`
    UPDATE tasks 
    SET name = $2, description = $3, done = $4, due_date = $5, list_id = $6 
    WHERE id=$1 
    RETURNING *
    `, 
    [taskId, task.name, task.description, task.done, task.due_date, task.list_id]);
    return updatedTask.rows;
  },

  async delete(taskId) {
    const task = await db.query(`DELETE FROM tasks WHERE id=$1 RETURNING *`, [taskId]);
    return task.rows;
  }
}