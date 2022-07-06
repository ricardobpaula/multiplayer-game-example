import express from "express"
import  {Server } from 'socket.io'
import { createServer } from 'http'

import createGame from './public/game.js'

const app = express()
const server = createServer(app)
const sockets = new Server(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subcribe((command)=> {
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    
    game.addPlayer({playerId})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer(playerId)
    })

    socket.on('move-player', (command)=>{
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })

})

server.listen(3000, () => {
    console.log(`Server listen on port: 3000`)
})