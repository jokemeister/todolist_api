require('dotenv').config();

const { Client } = require('pg')
const client = new Client()
client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

module.exports = {
  query: (text, params) => client.query(text, params)
}