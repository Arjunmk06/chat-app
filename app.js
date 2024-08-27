const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000

const app = express()
const server = app.listen(PORT, ()=> console.log(`listening to the port: ${PORT}`))

const io = require('socket.io')(server)
let serverConnected = new Set()

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', onConnected)


function onConnected(socket){
    console.log(socket.id)
    serverConnected.add(socket.id)
    
    io.emit('clients-total', serverConnected.size)

    socket.on('disconnect', ()=>{
        console.log("server diconneted" ,socket.id)
        serverConnected.delete(socket.id)
        io.emit('clients-total', serverConnected.size)
    })

    socket.on('message', (data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
    })
}



