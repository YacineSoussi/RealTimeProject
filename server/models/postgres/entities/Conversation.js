const { Model, DataTypes } = require("sequelize");
const connection = require("../db");

class Conversation extends Model {}

Conversation.init({
    maxParticipants: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
}, {
    sequelize: connection,
    modelName: "Conversation",
});

Conversation.beforeUpdate(async (conversation) => {
    if (conversation.completed) {
        throw new Error("Conversation is completed");
    }
});

Conversation.afterCreate(async (conversation) => {
    if(conversation.maxParticipants ===  conversation.participants.length) {
        conversation.completed = true;
    }
});
    
module.exports = Conversation;