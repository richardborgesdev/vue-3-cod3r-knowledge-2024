const config = require('../knexfile.js');
const knex = require('knex')(config);

// WARN: This is not a good to way to start migrations on back-end
knex.migrate.latest([config]);
module.exports = knex;
