require('dotenv').config();

// const { Client } = require('pg')
// const client = new Client()
// client.connect(err => {
//   if (err) {
//     console.error('connection error', err.stack)
//   } else {
//     console.log('connected')
//   }
// })

// module.exports = {
//   query: (text, params) => client.query(text, params)
// }

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  }
});

module.exports = knex;