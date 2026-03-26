const { Socket } = require('dgram');
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express();

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (req, res) => {
    res.render('index')
})

const server = http.createServer(app)

const io = new Server(server)

io.on('connection', (socket) =>{
    console.log('User connected:', socket.id)

    socket.on('join', (username)=> {
        console.log(`${username} joined the chat.`)
        socket.username = username // Store the username in the socket object
        io.emit('user_joined', `${username} has joined the chat.`) //Notify all clients that a usr has joined
    })

    socket.on('send_message', (data) => {
        console.log('Message received:', data)
        io.emit('receive_message', {username: socket.username, message: data})  //Broadcast the message to all clients
    })

    socket.on('disconnect', ()=> {
        console.log('User disconnected:', socket.id)
        if(socket.username){
            io.emit('user_left', `${socket.username} has left the chat.`)  // notify all clients that a user has left
        }
    })
})

server.listen(3000, () => {
    console.log('Server is running on port 3000')
})