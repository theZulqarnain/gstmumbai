module.exports = function(sequelize, Sequelize) {

    var pages = sequelize.define('pages', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
        title: {type: Sequelize.STRING, notEmpty: true},
        content: {type: Sequelize.TEXT, notEmpty: true},
    });

    return pages;

};