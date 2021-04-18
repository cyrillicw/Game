const unit = 15;

let a = 'check'
class Player {
    constructor(x, y, id) {
        this.id = id
        this.dead = false;
        this.direction = "";
        this.key = "UP";
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;

        this.constructor.counter = (this.constructor.counter || 0) + 1;
        this._id = this.constructor.counter;
    }
}
//
Player.allInstances = new Map();
//
//
// function getPlayableCells(width, height) {
//     let playableCells = new Set();
//     for (let i = 0; i < width; i++) {
//         for (let j = 0; j < height; j++) {
//             playableCells.add(`${i * unit}x${j * unit}y`);
//         }
//     }
//     return playableCells;
// }
//
let width = 50
let height = 50
// let playableCells = getPlayableCells(100, 100);
//
let outcome
//     playerCount = Player.allInstances.length;

let inputBuffer = new Map()
let players = 2
let last_processed = -1
let end = 0

module.exports = {
    add_input: (input) => {
        let tick = input['tick']
        if (tick === -1) {
            end += 1
            return null
        }
        let player = input['id']
        let key = input['key']
        if (!inputBuffer.has(tick)) {
            inputBuffer.set(tick, new Map())
        }
        inputBuffer.get(tick).set(player, key)
        Player.allInstances.get(player).key = key
        if (inputBuffer.get(tick).size === players && tick === last_processed + 1) {
            last_processed++
            let g = new Map()
            for (let p of Player.allInstances) {
                g.set(p[0], p[1].key)
            }
            return {tick: tick, players: Object.fromEntries(g)}
        }
        return null
    },

    add_player: (id) => {
        if (Player.allInstances.size < players) {
            let startX = Math.floor(Math.random() * width)
            let startY = Math.floor(Math.random() * height)
            let p = new Player(startX, startY, id)
            Player.allInstances.set(id, p)
            return p
        }
        return null
    },

    isReady: () => {
        return Player.allInstances.size === players
    },

    getPlayers: () => {
        return Player.allInstances
    },

    isFinished: () => {
        return end === players
    },

    clear: () => {
        Player.allInstances.clear()
        inputBuffer.clear()
        last_processed = -1
        end = 0
    }
}

function step() {
    let playersArray = Array.from(Player.allInstances.values())
    if (playersArray.filter((p) => !p.key).length === 0) {
        if (playerCount === 1) {
            const alivePlayers =playersArray.filter((p) => p.dead === false);
            outcome = `Player ${alivePlayers[0]._id} wins!`;
        } else if (playerCount === 0) {
            outcome = "Draw!";
        }
        playersArray.forEach((p) => {
            if (p.key) {
                p.direction = p.key;

                if (!playableCells.has(`${p.x}x${p.y}y`) && p.dead === false) {
                    p.dead = true;
                    p.direction = "";
                    playerCount -= 1;
                }

                playableCells.delete(`${p.x}x${p.y}y`);

                if (!p.dead) {
                    if (p.direction === "LEFT") p.x -= unit;
                    if (p.direction === "UP") p.y -= unit;
                    if (p.direction === "RIGHT") p.x += unit;
                    if (p.direction === "DOWN") p.y += unit;
                }
            }
        });
    }
}


// function resetGame() {
//     // Remove the results node
//     const result = document.getElementById("result");
//     if (result) result.remove();
//
//     // Remove background then re-draw it
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     drawBackground();
//
//     // Reset playableCells
//     playableCells = getPlayableCells(canvas, unit);
//
//     // Reset players
//     Player.allInstances.forEach((p) => {
//         p.x = p.startX;
//         p.y = p.startY;
//         p.dead = false;
//         p.direction = "";
//         p.key = "";
//     });
//     playerCount = Player.allInstances.length;
//     drawStartingPositions(Player.allInstances);
//
//     // Reset outcome
//     outcome = "";
//     winnerColor = "";
//
//     // Ensure draw() has stopped, then re-trigger it
//     clearInterval(game);
//     game = setInterval(draw, 100);
// }
