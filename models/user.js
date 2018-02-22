module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('users', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
        firstname   : {type: Sequelize.STRING,notEmpty: true},
        lastname    : {type: Sequelize.STRING,notEmpty: true},
        username    : {type: Sequelize.TEXT},
        email       : {type: Sequelize.STRING, validate: {isEmail:true} },
        password    : {type: Sequelize.STRING },
        status      : {type: Sequelize.ENUM('active','inactive'),defaultValue:'inactive' }
    });

    return User;

}