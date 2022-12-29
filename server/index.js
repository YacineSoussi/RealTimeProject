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

const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

// ------------------ MIDDLEWARE ------------------ //

app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
);

app.use("/", userRoutes);
app.use("/", securityRoutes);
app.use("/", messageRoutes);
app.use("/", participantRoutes);
app.use("/", conversationRoutes);

// ------------------ CHATBOT ------------------ //

io.on("connection", function (socket) {
	socket.on("message", function (response, message) {
		if (response === 0) {
			socket.emit(
				"message_bot",
				"Veuillez sélectionner une option dans la liste proposée."
			);
		} else {
			// TODO
		}
	});
});

// ------------------ SERVER ------------------ //

server.listen(port, () => console.log(`Server is running on port ${port}`));
