// ------------------ INITIALIZATIONS ------------------ //

const userRoutes = require("./models/routes/users");
const securityRoutes = require("./models/routes/security");
const messageRoutes = require("./models/routes/messages");
const participantRoutes = require("./models/routes/participants");
const conversationRoutes = require("./models/routes/conversations");

const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const port = 3000;
const socketIo = require("socket.io");

const server = http.createServer(app);

const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

// We register a middleware which checks the username and allows the connection:
io.use((socket, next) => {
	const userId = socket.handshake.auth.userId;

	if (!userId) {
		return next(new Error("invalid userId"));
	}

	// On enregistre l'utilisateur dans la socket avec son id donné par le client
	socket.userId = userId;
	socket.join(userId);

	next();
});

io.on("connection", (socket) => {
	const users = [];

	// We are looping over the io.of("/").sockets object, which is a Map of all currently connected Socket instances, indexed by ID.
	for (let [id, socket] of io.of("/").sockets) {
		users.push({
			SocketId: id,
			userId: socket.userId,
		});
	}

	// We send all existing users to the client:
	socket.emit("users", users);

	// TODO remove for production
	// We also register a catch-all listener, which is very useful during development:
	socket.onAny((event, ...args) => console.log(event, args));

	socket.on(
		"message:private",
		({ content, to, author, ConversationMaj, data }) => {
			io.to((userId = to)).emit("message:private", {
				content,
				to,
				author,
				ConversationMaj,
				data,
			});
		}
	);

	socket.on(
		"message:room",
		({ content, to, author, ConversationMaj, data }) => {
			io.to((roomId = to)).emit("message:room", {
				content,
				to,
				author,
				ConversationMaj,
				data,
			});
		}
	);

	socket.on("join:room", ({ roomId, userId }) => {
		socket.join(roomId);
		io.to(roomId).emit("join:room", { roomId, userId });
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

// ------------------ SERVER ------------------ //

server.listen(port, () => console.log(`Server is running on port ${port}`));
