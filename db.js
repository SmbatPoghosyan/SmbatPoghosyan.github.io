const knex = require('knex');
const knexConfig = require('./knexfile.js');
const { Model } = require('objection');

// Initialize knex
const knexInstance = knex(knexConfig.development);

// Bind all Models to a knex instance.
Model.knex(knexInstance);

module.exports = knexInstance;
