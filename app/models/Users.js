const bcrypt = require('bcrypt');

module.exports = (db, Sequelize) => {

    let Users = db.define('users', {
        username: {
            type: Sequelize.STRING(32),
            allowNull: false,
            primaryKey: true,
        },

        firstName: {
            type: Sequelize.STRING(64),
            allowNull: false,
        },

        lastName: {
            type: Sequelize.STRING(64),
            allowNull: false,
        },

        isOnline: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        lastOnline: {
            type: Sequelize.DATE,
            defaultValue: null,
        },

        password: {
            type: Sequelize.STRING(64),
            allowNull: false,
        }
    }, {
        timestamps: false,
    });

    Users.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    function generateHash(user) {
        return user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
    }

    Users.beforeCreate(generateHash);

    Users.beforeUpdate(generateHash);

    return Users;

};