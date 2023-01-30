const { Model, DataTypes } = require("sequelize");

const connection = require("../db");

class Conversation extends Model {}

Conversation.init(
	{
		maxParticipants: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize: connection,
		modelName: "Conversation",
	}
);

Conversation.beforeUpdate(async (conversation) => {
	if (conversation.completed) {
		throw new Error("Conversation is completed");
	}
});

module.exports = Conversation;
