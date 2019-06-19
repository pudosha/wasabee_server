module.exports = (db, Sequelize) => {

    let Chats = db.define('chats', {
        chatID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        chatName: {
            type: Sequelize.STRING(64),
        },
    }, {
        timestamps: false,
    });

    return Chats;

};