// create server express
const express = require('express');
const userRoutes = require('./models/routes/users');
const securityRoutes = require('./models/routes/security');
const messageRoutes = require('./models/routes/messages');
const participantRoutes = require('./models/routes/participants');
const conversationRoutes = require('./models/routes/conversations');
const cors = require('cors');
const app = express();
const port = 3000;
const socketIo = require('socket.io');

const server = require('http').createServer(app);


const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use('/', userRoutes);
app.use('/', securityRoutes);
app.use('/', messageRoutes);
app.use('/', participantRoutes);
app.use('/', conversationRoutes);



// create server http
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// we register a middleware which checks the username and allows the connection:
io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
        return next(new Error("invalid userId"));
    }

    // On enregistre l'utilisateur dans la socket avec son id donné par le client
    socket.userId = userId;
    socket.join(userId)

    next();
});

io.on('connection', (socket) => {

    console.log("connection", socket.id);
    // we send all existing users to the client:
    const users = [];

    // We are looping over the io.of("/").sockets object, which is a Map of all currently connected Socket instances, indexed by ID.
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            SocketId: id,
            userId: socket.userId,
        });
    }
    socket.emit("users", users);

    //   We also register a catch-all listener, which is very useful during development:
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.on('message:private', ({content, to, author, ConversationMaj, data}) => {
        
        io.to(userId = to).emit('message:private', {content, to, author, ConversationMaj, data});
    });

    socket.on('message:room', ({content, to, author, ConversationMaj, data}) => {
    
        io.to(roomId = to).emit('message:room', {content, to, author, ConversationMaj, data});
    });

    socket.on('join:room', ({roomId, userId}) => {

        socket.join(roomId);
        io.to(roomId).emit('join:room', {roomId, userId});
    });

    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}
);
