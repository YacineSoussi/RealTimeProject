exports.connection = require("./db");
exports.User = require("./entities/User");
exports.Message = require("./entities/Message");
exports.Conversation = require("../postgres/entities/Conversation");
exports.Participant = require("./entities/Participant");
exports.CommunicationRequest = require("./entities/CommunicationRequest");

exports.User.hasMany(exports.Participant, {
	foreignKey: "userId",
});

exports.Participant.belongsTo(exports.User, {
	foreignKey: "userId",
});

exports.User.hasMany(exports.Message, {
	foreignKey: "authorId",
});

exports.Message.belongsTo(exports.User, {
	foreignKey: "authorId",
});

exports.Conversation.hasMany(exports.Message, {
	foreignKey: "conversationId",
});

exports.Message.belongsTo(exports.Conversation, {
	foreignKey: "conversationId",
});

exports.Conversation.hasMany(exports.Participant, {
	foreignKey: "conversationId",
});

exports.Participant.belongsTo(exports.Conversation, {
	foreignKey: "conversationId",
});

exports.Conversation.belongsTo(exports.Message, {
	foreignKey: "lastMessageId",
});

exports.Message.belongsTo(exports.Conversation);

exports.User.hasMany(exports.CommunicationRequest, {
    foreignKey: "clientId",
});

exports.CommunicationRequest.belongsTo(exports.User, {
    foreignKey: "clientId",
});
