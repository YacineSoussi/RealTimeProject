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

// ------------------ SERVER ------------------ //

server.listen(port, () => console.log(`Server is running on port ${port}`));
