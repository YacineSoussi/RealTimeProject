// create server express
const express = require('express');
const app = express();
const port = 3000;

// create server socket.io
const server = require('http').createServer(app);
// const io = require('socket.io')(server);

// create server http
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// create server socket.io