module.exports = function(sequelize, Sequelize) {

    var User = sequelize.define('users', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
        firstname   : {type: Sequelize.STRING,notEmpty: true},
        lastname    : {type: Sequelize.STRING,notEmpty: true},
        username    : {type: Sequelize.STRING},
        email       : {type: Sequelize.STRING,allowNull: false, validate: {isEmail:true}},
        resetPasswordToken:{type: Sequelize.STRING},
        resetPasswordExpires:{type: Sequelize.DATE},
        password    : {type: Sequelize.STRING },
        status: {type: Sequelize.ENUM('active', 'inactive'), defaultValue: 'inactive'},
        role: {type: Sequelize.ENUM('Admin', 'Author'), defaultValue: 'Author'}
    });

    return User;

};