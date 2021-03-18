const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('node-complete', 'root', 'joker1224', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
