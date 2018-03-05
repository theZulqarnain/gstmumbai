module.exports = function (sequelize, Sequelize) {

    var recentEvents = sequelize.define('recentEvents', {
        id: {autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
        name: {type: Sequelize.STRING, notEmpty: true},
        path: {type: Sequelize.TEXT, notEmpty: true},
    });
    return recentEvents;

};