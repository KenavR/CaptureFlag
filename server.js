const express = require("express");
const SocketServer = require("ws").Server;
const path = require("path");
const PORT = process.env.PORT || 3000;

const INDEX = path.join(__dirname, "client/index.html");

const Game = require("./game");
const Player = require("./player");

function Server() {
  this.httpServer;
  this.websocketServer;

  this.games = [];
  this.init();
}

Server.prototype.init = function init() {
  this.httpServer = express().use(express.static("client"), (req, res) =>
    res.sendFile(INDEX)
  );
};

Server.prototype.initWebsocketMessage = function initWebsocketMessage() {
  function createGame() {
    function getId() {
      // Should be replaced with something else, maybe database
      return Math.random()
        .toString(36)
        .substr(2, 9);
    }

    const game = new Game(getId());
    game.start();
    this.games.push(game);
    return game;
  }

  function getGameWithFreeSlot() {
    return this.games.find(game => game.hasFreeSlot());
  }

  function close(ws) {
    /* Not the most efficient way, since it runs on every game - nothing happens if the player is not playing the game */
    this.games.forEach(game => game.removePlayerByWS(ws));
  }

  function handleMessage(ws, e) {
    try {
      var message = JSON.parse(e);
      if (message && message.hasOwnProperty("gameId")) {
        var gameId = message.gameId;
        var game = this.games.find(game => game.id === gameId);
        if (game && game.isPlayer(ws)) {
          game.processMessage(message);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  this.websocketServer.on("connection", ws => {
    ws.on("close", close.bind(this, ws));
    ws.on("error", close.bind(this, ws));

    let activeGame = getGameWithFreeSlot.call(this);
    /* if no game exists or all games are full, create a new one */
    if (this.games.length <= 0 || !activeGame) {
      activeGame = createGame.call(this);
    }
    activeGame.addPlayer(new Player(ws));

    ws.on("message", handleMessage.bind(this, ws));
  });
};

Server.prototype.start = function start(port = PORT) {
  this.httpServer = this.httpServer.listen(port, () =>
    console.log(`Listening on ${port}`)
  );
  this.websocketServer = new SocketServer({ server: this.httpServer });
  this.initWebsocketMessage();
};

module.exports = exports = Server;

// function isWall(grid) {
//Use manually created map
// return map1[grids.length];

//Use randomly generated map
// return grid.x == 0 || grid.x == 100 ||
// grid.x == (gridRowLength-1)*100 || grid.x == (gridRowLength-1)*100-100 ||
// grid.y == 0 || grid.y == 100 ||
// grid.y == (gridRowLength-1)*100 || grid.y == (gridRowLength-1)*100-100 ? 1 : Math.round(Math.random()*100)+1 <= 16 ? 1 : 0;
// }
