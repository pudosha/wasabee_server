module.exports = (db, Sequelize) => {

    let ChatUsers = db.define('chatUsers', {
        chatID: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        username: {
            type: Sequelize.STRING(32),
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    return ChatUsers;

};