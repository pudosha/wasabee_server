const Sequelize = require('sequelize')
    , config = require('./config')
    , bcrypt = require('bcrypt')
    , moment = require('moment');

const sequelize = new Sequelize('wasabee', config.dbLogin, config.dbPassword, {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const Users = sequelize.define('users', {
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


const Messages = sequelize.define('messages', {
    messageID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    chatID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

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

const Chats = sequelize.define('chats', {
    chatID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    chatName: {
        type: Sequelize.STRING(64),
    },

    lastMessageID: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
}, {
    timestamps: false,
});

const ChatUser = sequelize.define('chat_user', {
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

sequelize.sync();

module.exports = {
    Users: Users,
    Messages: Messages,
    Chats: Chats,
    ChatUser: ChatUser,
};