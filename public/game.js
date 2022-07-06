export default  function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
        
    }
    const observers = []

    function start() {
        const frequency = 2000

        setInterval(addFruit, frequency)
    }

    function subcribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const { playerId, playerX, playerY }= command
        const { width, height } = state.screen

        const x = 'playerX' in command ? playerX : Math.floor(Math.random() * width)
        const y = 'playerY' in command ? playerY : Math.floor(Math.random() * height)

        state.players[playerId] = {
            x,
            y
        }

        notifyAll({
            type: 'add-player',
            playerId,
            playerX: x,
            playerY: y
        })
    }

    function removePlayer(playerId) {
        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId
        })
    }

    function addFruit(command) {
        const { width, height } = state.screen

        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)
    
        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        })
    }

    function removeFruit(fruitId) {
        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId
        })
    }

    function movePlayer(command) {
        notifyAll(command)
        const commands = {
            w(player) {
                if(player.y -1 >= 0){
                    player.y = player.y - 1
            }
            },
            s(player) {
                if(player.y + 1 < state.screen.height){
                    player.y = player.y + 1
                }
            },
            a(player) {
                if(player.x - 1 >= 0){
                    player.x = player.x - 1
                }
            },
            d(player) {
                if(player.x + 1 < state.screen.width){
                    player.x = player.x + 1
                }
            }
        }
        const player = state.players[command.playerId]
        const {key, playerId} = command
        const runCommand = commands[key]
        if (player && runCommand){
            runCommand(player)
            checkFruitCollision(playerId)
        }
    }

    function checkFruitCollision(playerId){
        const player = state.players[playerId]

        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]
            if(player.x === fruit.x && player.y === fruit.y){
                removeFruit(fruitId)
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        state,
        setState,
        subcribe,
        start
    }

}