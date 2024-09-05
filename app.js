import {Server} from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config({
    path: './.env'
})


const io = new Server({
    cors: {
        origin: process.env.CLIENT_URL
    }
}
)

let onlineUser = []
const addUser = (userId, socketId) => {
    const userExists = onlineUser.find((user) => user.userId === userId)
    if(!userExists) {
        onlineUser.push({userId, socketId})
    }
}

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter(user => user.socketId !== socketId )
}

const getUser = (userId) => {
    return onlineUser.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
    socket.on("newUser" , (userId) => {
        addUser(userId, socket.id)
        console.log(onlineUser)
    })

    socket.on("sendMessage", ({receiverId, data}) => {
        console.log("ReceiverId is: ", receiverId)
        console.log("data is: ", data)
        const receiver = getUser(receiverId)
        if(receiver) {
            io.to(receiver.socketId).emit("getMessage", data)
        }
    })

    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
})

io.listen( "4000" )