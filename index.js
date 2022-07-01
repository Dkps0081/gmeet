const express = require('express');
const os = require('os');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const { v4: uuidv4 } = require('uuid');

const port = 3000;
const host = 'localhost';

app.set('view engine', 'ejs');
app.use(express.static('public'));

const sort = 4000;
//defining a route
app.get('/', (req, res) => {
    console.log('request made');
    res.redirect(`/${uuidv4()}`);

});

app.get('/:room', (req, res) => {
    res.render('index', { roomid: req.params.room }); //to get roomid in index.ejs
})

///////////////
app.get('/about', (req, res) => {
    res.render('about');
})


server.listen(port, host, () => {
    console.log(`listening to port:${port},host:${host}`);
});

io.on('connection', socket => {
    console.log('user connected');
    socket.on('join-room', (roomid, userid) => {
        console.log(roomid, userid);
        socket.join(roomid);
        //**below both lines are same as broadcast automatically to other users expect itself */
        //socket.to(roomid).emit('user-connected', roomid, userid);
        socket.broadcast.to(roomid).emit('user-connected', userid);
        socket.on('disconnect', () => {
            console.log('userdisconnected :' + userid);
            socket.broadcast.to(roomid).emit('user-disconnected', userid);
        })


    })

});