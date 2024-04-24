import express from "express"
import path from "path"
import { Server, Socket } from "socket.io";

const app=express()
const port =2000
const server=app.listen(port,()=>{
    console.log(`app is runnong at ${port}`)
})

// app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.resolve('./public')))
let socketsConnected=new Set()
const io = new Server(server);
io.on('connection',onConnection)
function onConnection(socket:Socket){
    console.log('socket connected', socket.id)
socketsConnected.add(socket.id)
io.emit('clints-total',socketsConnected.size)
    socket.on('disconnect',()=>{
        console.log('socket disconnected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })
    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data)
    })
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
      })
}
app.get('/',(req,res)=>{
    res.sendFile("/public/index.html")
})