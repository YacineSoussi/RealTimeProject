import {io} from 'socket.io-client';

const url = io('http://localhost:3000');
const socket = io(url, {
    autoConnect: false
});

export default socket;

