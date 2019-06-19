module.exports = (db, Sequelize) => {

    let Messages = db.define('messages', {
        messageID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
/*
        chatID: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
*/
        username: {
            type: Sequelize.STRING(32),
            allowNull: false,
        },

        message: {
            type: Sequelize.STRING(1024),
            allowNull: false,
        },

        isEdited: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        updatedAt: false,
        createdAt: "date",
    });

    return Messages;

};