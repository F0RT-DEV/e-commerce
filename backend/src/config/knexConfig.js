// src/config/knexConfig.js
import knex from 'knex';
import config from '../../knexfile.js';

const db = knex(config.development); // usa a config do knexfile
export default db;
