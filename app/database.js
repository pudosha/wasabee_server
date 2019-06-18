const Sequelize = require('sequelize')
    , config = require('./config')
    , bcrypt = require('bcrypt');

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
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    username: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true,
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

Users.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

function generateHash(user) {
    return user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
}

Users.beforeCreate(generateHash);

Users.beforeUpdate(generateHash);


const Messages = sequelize.define('messages', {
    messageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    message: {
        type: Sequelize.STRING(1024),
        allowNull: false,
    },

    date: {
        type: Sequelize.DATE,
        allowNull: false
    },

    isEdited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: false,
});

Messages.beforeCreate(function (message) {
    message.date = sequelize.fn('NOW');
});

const Chats = sequelize.define('chats', {
    chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    chatName: {
        type: Sequelize.STRING(64),
    },

    lastMessageId: {
        type: Sequelize.INTEGER,
        defaultValue: null,
    },
}, {
    timestamps: false,
});

const Updates = sequelize.define('updates', {
    updateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    updateType: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    messageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

const ChatUser = sequelize.define('chat_user', {
    chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    userId: {
        type: Sequelize.INTEGER,
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
    Updates: Updates,
    ChatUser: ChatUser,
};