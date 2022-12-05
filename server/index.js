// create server express
const express = require('express');
const userRoutes = require('./models/routes/users');
const securityRoutes = require('./models/routes/security');
const cors = require('cors');
const app = express();
const port = 3000;

// create server socket.io
const server = require('http').createServer(app);
// const io = require('socket.io')(server);

app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use('/', userRoutes);
app.use('/', securityRoutes);



// create server http
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// create server socket.io