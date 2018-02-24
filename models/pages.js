module.exports = function(sequelize, Sequelize) {

    var pages = sequelize.define('pages', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
        title    : {type: Sequelize.STRING },
        content    : {type: Sequelize.TEXT},
    });

    console.log(pages.create, "wwww")
    return pages;

};