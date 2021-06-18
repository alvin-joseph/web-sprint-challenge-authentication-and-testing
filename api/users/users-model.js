const db = require('../../data/dbConfig')

function findBy(filter) {
    return db('users').where(filter)
      .orderBy('id')
}

module.exports = { findBy }