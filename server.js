const express = require('express');
const http = require('http');
const webSocket = require('ws')
const game = require('./game')

let app = express();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html')
});

app.use(express.static('public'));

const httpServer = http.createServer(app );
const wss = new webSocket.Server({ server: httpServer });
httpServer.listen(8080, hostname='0.0.0.0');

wss.on('connection', (ws) => {

    let player = game.add_player(Math.random())
    if (player) {
        let playerAsDict = JSON.parse(player.id)
        ws.send(JSON.stringify({type: 'reg', body: {id: playerAsDict}}))
        if (game.isReady()) {
            wss.clients.forEach((client) => {
                if (client.readyState === webSocket.OPEN) {
                    client.send(JSON.stringify({type: 'start' , body: Object.fromEntries(game.getPlayers())}));
                }
            });
        }
    }
    ws.on('message', function(message) {
        let input = JSON.parse(message)
        let state = game.add_input(input)
        console.log(state)
        if (state) {
            wss.clients.forEach((client) => {
                if (client.readyState === webSocket.OPEN) {
                    client.send(JSON.stringify({type: 'sync', body: state}));
                }
            });
        }
        if (game.isFinished()) {
            game.clear()
        }
    });
})