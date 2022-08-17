const db = require('../db');

module.exports = {
  async findAll() {
    let lists = await db.query(`
      SELECT * 
      FROM lists
    `);
    return lists.rows;
  },

  async findOne(listID) {
    let list = await db.query(`SELECT * FROM lists WHERE id=$1`, [listID]);
    return list.rows;
  },

  async create(list) {
    let newlist = await db.query(`
      INSERT INTO lists (id, name) 
      VALUES ($1, $2) 
      RETURNING *
    `, 
    [list.id, list.name]);
    return newlist.rows;
  },

  async update(listId, list) {
    let newList = await db.query(`
      UPDATE lists 
      SET name = $2
      WHERE id=$1 RETURNING *
    `, 
    [listId, list.name]);
    return newList.rows;
  },

  async delete(listId) {
    const list = await db.query(`DELETE FROM lists WHERE id=$1 RETURNING *`, [listId]);
    return list.rows;
  }
}