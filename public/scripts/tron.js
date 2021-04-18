const canvas = document.getElementById("tron");
const context = canvas.getContext("2d");
const unit = 15;

class Player {
  constructor(x, y, color) {
    this.color = color || "#fff";
    this.dead = false;
    this.direction = "";
    this.key = "";
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.constructor.counter = (this.constructor.counter || 0) + 1;
    this._id = this.constructor.counter;
  }
}

class HistoryNote {
  constructor(players, cells, playerCount) {
    this.players = players // JSON.parse(JSON.stringify(players));
    this.cells = cells // Object.assign(new Set(), cells)
    this.playerCount = playerCount
  }
}


function setKey(key, player, up, right, down, left) {
  switch (key) {
    case up:
      if (player.direction !== "DOWN") {
        player.key = "UP";
      }
      break;
    case right:
      if (player.direction !== "LEFT") {
        player.key = "RIGHT";
      }
      break;
    case down:
      if (player.direction !== "UP") {
        player.key = "DOWN";
      }
      break;
    case left:
      if (player.direction !== "RIGHT") {
        player.key = "LEFT";
      }
      break;
    default:
      break;
  }
}

function handleKeyPress(event) {
  let key = event.keyCode;
  if (key === 37 || key === 38 || key === 39 || key === 40) {
    event.preventDefault();
  }

  setKey(key, history[lastTick - 1].players[0], 38, 39, 40, 37); // arrow keys
  // setKey(key, p2, 87, 68, 83, 65); // WASD
  // setKey(key, p3, 73, 76, 75, 74); // IJKL
  // setKey(key, p4, 104, 102, 101, 100); // numpad 8456
}



function getPlayableCells(width, height) {
  let playableCells = []
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      playableCells[i * height + j] = 2
    }
  }
  return playableCells;
}

let width = 50
let height = 50


function drawBackground() {
  context.strokeStyle = "#001900";
  for (let i = 0; i <= canvas.width / unit + 2; i += 2) {
    for (let j = 0; j <= canvas.height / unit + 2; j += 2) {
      context.strokeRect(0, 0, unit * i, unit * j);
    }
  }

  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  for (let i = 1; i <= (canvas.width + unit) / unit; i += 2) {
    for (let j = 1; j <= (canvas.height + unit) / unit; j += 2) {
      context.strokeRect(0, 0, unit * i, unit * j);
    }
  }
  context.lineWidth = 1;
}

drawBackground();

// function drawStartingPositions(players) {
//   players.forEach((p) => {
//     context.fillStyle = p.color;
//     context.fillRect(p.x * unit, p.y * unit, unit, unit);
//     context.strokeStyle = "black";
//     context.strokeRect(p.x * unit, p.y * unit, unit, unit);
//   });
// }
// drawStartingPositions(Player.allInstances);

let outcome,
  winnerColor

let history = []
let lastTick = 0

function isValid(a, i, j) {
  if (!(0 <= i && i <= width)) {
    return false;
  }
  if (!(0 <= j && j <= height)) {
    return false;
  }
  return a[i * height + j] === 2
}

function draw(tick) {
  // console.log(tick, lastTick)
  // console.log(history[- 1].cells)
  for (let t = tick; t < lastTick + 1; t++) {
    // console.log('in for')
    // console.log('here')
    // console.log(i - 1)
    let playableCells = JSON.parse(JSON.stringify(history[t - 1].cells));
    let players = JSON.parse(JSON.stringify(history[t - 1].players));
    // console.log(players)
    let playerCount = history[t - 1].playerCount
    if (playerCount === 1) {
      const alivePlayers = players.filter((p) => p.dead === false);
      if (alivePlayers[0].id === myId) {
        outcome = 'Victory'
      }
      else {
        outcome = 'Defeat'
      }
      winnerColor = alivePlayers[0].color;
    } else if (playerCount === 0) {
      outcome = "Draw!";
    }

    if (outcome) {
      createResultsScreen(winnerColor);
      clearInterval(game);
    }
    for (let j = 0; j < players.length; j++)  {
      let p = players[j]
      if (p.key) {
        // console.log('key')
        p.direction = p.key;
        // context.fillStyle = p.color;
        // context.fillRect(p.x * unit, p.y * unit, unit, unit);
        // context.strokeStyle = "black";
        // context.strokeRect(p.x * unit, p.y * unit, unit, unit);
        // console.log(playableCells)
        // console.log(isValid(playableCells, p.x, p.y))
        if (!p.dead) {
          if (p.direction === "LEFT") p.x -= 1;
          if (p.direction === "UP") p.y -= 1;
          if (p.direction === "RIGHT") p.x += 1;
          if (p.direction === "DOWN") p.y += 1;
        }
        if (!isValid(playableCells, p.x, p.y) && p.dead === false) {
          console.log('dead')
          p.dead = true;
          p.direction = "";
          playerCount -= 1;
        }
        else if (!p.dead) {
          playableCells[p.x * height + p.y] = j
        }
      }
    }
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground()
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (playableCells[i * height + j] !== 2) {
          context.fillStyle = players[playableCells[i * height + j]].color;
          context.fillRect(i * unit, j * unit, unit, unit);
          context.strokeStyle = "black";
          context.strokeRect(i * unit, j * unit, unit, unit);
        }
      }
    }
    // console.log(players[0].y)
    history[t] = new HistoryNote(players, playableCells, playerCount)
  }
}

// function draw() {
//
//   let h = new HistoryNote(Player.allInstances, playableCells)
//
//   connection.send(JSON.stringify({tick: tick, id: myId, key: me.key}))
//   tick += 1
// }
document.addEventListener("keydown", handleKeyPress);
const url = "ws://192.168.1.106:8080"
const connection = new WebSocket(url)
connection.onopen = e => {
  // connection.send(JSON.stringify({'hello' : 'hi'}));
}
let myId, game
let me
connection.onmessage = e => {
  let data = JSON.parse(e.data)
  if (data.type === 'reg') {
    myId = data.body.id
    // console.log(typeof myId)
  }
  else if (data.type === 'start') {
    if (myId in data.body) {
      let players = []
      for(let playerId in data.body) {
        playerId = parseFloat(playerId)
        let player = Object.assign(new Player(), data.body[playerId])
        if (playerId === myId) {
          player.color = '#ff0000'
          players[0] = player
        }
        else {
          player.color = '#0000ff'
          players[1] = player
        }
        // players.push(player)
        if (playerId === myId) {
          me = player
        }
        let playerCount = 2;
        let playableCells = getPlayableCells(width, height);
        history[- 1] = new HistoryNote(players, playableCells, playerCount)
        document.addEventListener("keydown", handleKeyPress);
      }
      game = setInterval(() => {
        // console.log(history.length)
        draw(lastTick)
        if (outcome) {
          connection.send(JSON.stringify({tick: -1}))
          connection.close()
        }
        else {
          connection.send(JSON.stringify({tick: lastTick, id: myId, key: history[lastTick].players[0].key}))
        }
        lastTick += 1
      }, 100);
    }
  }
  else if (data.type === 'sync') {
      let tick = data.body['tick']
      // console.log(typeof data.body['players'])
      for (let id in data.body['players']) {
        id = parseFloat(id)
        if (id !== myId) {
          // console.log('not', id, myId)
          if (data.body['players'][id] !== history[tick].players[1].key) {
            // console.log('need')
            history[tick].players[1].key = data.body['players'][id]
            draw(tick + 1)
          }
        }
      }
  }
}
// connection.onmessage = e => {
//   let data = JSON.parse(e.data);
//   let rows_list = document.getElementById("names");
//   let li = document.createElement("li");
//   li.innerHTML = "<span>Name: " + data.name + "</span></br><span>Entropy: " + data.entropy + "</span>";
//   rows_list.appendChild(li);
//   console.log(e.data)
// }

//


function createResultsScreen(color) {
  const resultNode = document.createElement("div");
  resultNode.id = "result";
  resultNode.style.color = color || "#fff";
  resultNode.style.position = "fixed";
  resultNode.style.top = 0;
  resultNode.style.display = "grid";
  resultNode.style.gridTemplateColumns = "1fr";
  resultNode.style.width = "100%";
  resultNode.style.height = "100vh";
  resultNode.style.justifyContent = "center";
  resultNode.style.alignItems = "center";
  resultNode.style.background = "#00000088";

  const resultText = document.createElement("h1");
  resultText.innerText = outcome;
  resultText.style.fontFamily = "Bungee, cursive";
  resultText.style.textTransform = "uppercase";

  const replayButton = document.createElement("button");
  replayButton.innerText = "Replay";
  replayButton.style.fontFamily = "Bungee, cursive";
  replayButton.style.textTransform = "uppercase";
  replayButton.style.padding = "10px 30px";
  replayButton.style.fontSize = "1.2rem";
  replayButton.style.margin = "0 auto";
  replayButton.style.cursor = "pointer";
  replayButton.onclick = () => window.location.reload(false);

  resultNode.appendChild(resultText);
  resultNode.appendChild(replayButton);
  document.querySelector("body").appendChild(resultNode);

  // document.addEventListener("keydown", (e) => {
  //   let key = event.keyCode;
  //   if (key == 13 || key == 32 || key == 27 || key == 82) resetGame();
  // });
}

// function resetGame() {
//   // Remove the results node
//   const result = document.getElementById("result");
//   if (result) result.remove();
//
//   // Remove background then re-draw it
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   drawBackground();
//
//   // Reset playableCells
//   playableCells = getPlayableCells(canvas, unit);
//
//   // Reset players
//   Player.allInstances.forEach((p) => {
//     p.x = p.startX;
//     p.y = p.startY;
//     p.dead = false;
//     p.direction = "";
//     p.key = "";
//   });
//   playerCount = Player.allInstances.size;
//   drawStartingPositions(Player.allInstances);
//
//   // Reset outcome
//   outcome = "";
//   winnerColor = "";
//
//   // Ensure draw() has stopped, then re-trigger it
//   clearInterval(game);
//   game = setInterval(draw, 100);
// }
