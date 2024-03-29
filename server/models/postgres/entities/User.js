const { Model, DataTypes, Sequelize } = require("sequelize");

const connection = require("../db");
const bcryptjs = require("bcryptjs");

class User extends Model {}

User.init(
	{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: {
					min: 8,
					max: 255,
				},
			},
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: {
					min: 1,
				},
			},
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				len: {
					min: 1,
				},
			},
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "user",
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		sequelize: connection,
		modelName: "Users",
	}
);

const hashPassword = async (user) => {
	user.password = await bcryptjs.hash(
		user.password,
		await bcryptjs.genSalt(10)
	);
};

User.addHook("beforeCreate", hashPassword);
User.addHook("beforeUpdate", async (user, { fields }) => {
	if (fields.includes("password")) {
		await hashPassword(user);
	}
});

module.exports = User;
