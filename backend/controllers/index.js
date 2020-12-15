// 1. Creating the controllers of my full stack web application
const usersControllers = require('./usersControllers');
const experiencesControllers = require('./experiencesControllers');
const reservationsControllers = require('./reservationsControllers');
const commentsControllers = require('./commentsControllers');

// 2. Exporting my controllers
module.exports = {
    usersControllers,
    experiencesControllers,
    reservationsControllers,
    commentsControllers
};