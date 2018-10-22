var DEFAULTS = require("./defaults");
var Grid = require("./grid");

function Game(id) {
	this.id = id;
	this.players = [];
	this.map = [];
	this.grids = [];
	this.redFlagSpawn = -1;
	this.blueFlagSpawn = -1;
	this.init()
}

Game.prototype.init = function init() {
	var gridRowLength = DEFAULTS.GridRowLength;
	//0 = empty
	//1 = wall 
	//2 = edge wall
	//3 = spike
	//4 = boost 4.1 = Up, 4.2 = Right, 4.3 = Down, 4.2 = Left
	//5 = team flag spawn
	//8 = red team spawn points
	//9 = blue team spawn points
	this.map = [
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
		3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 0, 8, 2, 3,
		3, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 8, 0, 8, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 8, 4.4, 5, 0, 8, 2, 3,
		3, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 8, 4.3, 8, 0, 2, 3,
		3, 2, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 1, 8, 0, 8, 2, 3,
		3, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 3,
		3, 2, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 4.1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4.3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4.2, 3, 0, 3, 4.4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 4.1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4.3, 0, 0, 0, 2, 3,
		3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 2, 3,
		3, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 2, 3,
		3, 2, 9, 0, 9, 1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0, 2, 3,
		3, 2, 0, 9, 4.1, 9, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 3,
		3, 2, 9, 0, 5, 4.2, 9, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 0, 9, 0, 9, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 3,
		3, 2, 9, 0, 9, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3,
		3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,
		3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
	];

	this.redFlagSpawn = this.map.indexOf(5);
	this.blueFlagSpawn = this.map.indexOf(5, this.redFlagSpawn + 1);

	for (var i = 0; i < gridRowLength; i++) {
		for (var j = 0; j < gridRowLength; j++) {
			this.grids.push(new Grid(j * 100, i * 100, this.map[j + i * gridRowLength], this))
		}
	}
};

Game.prototype.hasFreeSlot = function hasFreeSlot() {
	return this.players.length < DEFAULTS.MaxPlayersPerGame
};

Game.prototype.addPlayer = function addPlayer(player) {
	this.players.push(player);
	player.setPlayedGame(this);
	const index = this.players.length - 1;

	player.ws.send(JSON.stringify({
		type: "initPlayer",
		player: [this.players[index].x, this.players[index].y, this.players[index].id],
		grids: this.grids.map(grid => Object.assign({}, grid, {
			game: null
		}))
	}))
};

Game.prototype.removePlayerByWS = function removePlayer(ws) {
	this.players = this.players.filter(p => p.ws !== ws)
};

Game.prototype.isPlayer = function isPlayer(ws) {
	return this.players.some(player => player.ws === ws)
};

Game.prototype.processMessage = function processMessage(message) {
	var messageIndex;
	for (var i = 0; i < this.players.length; i++) {
		if (this.players[i].id == message.id) {
			messageIndex = i;
			break
		}
	}
	if (message.type == "playerMove") {
		this.players[messageIndex].move = message.move
	} else if (message.type == "boost") {
		if (!this.players[messageIndex].hasFlag) {
			this.players[messageIndex].moveSpeed = 0.7;
			this.players[messageIndex].velX *= 2;
			this.players[messageIndex].velY *= 2;
			setTimeout(function() {
				this.players[messageIndex].moveSpeed = 0.2
			}.bind(this), 500);
		}
	}
};

Game.prototype.start = function start() {
	function gameLoop() {
		try {
			var minimizedPlayers = [];
			for (var i = 0; i < this.players.length; i++) {
				this.players[i].update();
				minimizedPlayers.push([this.players[i].x.toFixed(2), this.players[i].y.toFixed(2), this.players[i].team]);

				if (this.players[i].hasFlag) {
					minimizedPlayers[minimizedPlayers.length - 1].push(this.players[i].hasFlag)
				}
			}
			for (var i = 0; i < this.players.length; i++) {
				if (this.players[i].ws.readyState === this.players[i].ws.OPEN) {
					this.players[i].ws.send(JSON.stringify({
						gameId: this.id,
						type: "gameUpdate",
						x: this.players[i].x.toFixed(2),
						y: this.players[i].y.toFixed(2),
						players: minimizedPlayers
					}))
				} else {
					console.log("setInterval delete 1 player jasljdajlksfjlkafjlkajlkfjlkfjlkasljkfljskfljkfljkasjkfjlafjlkaf");
					this.players[i].reset();
					this.players.splice(i, 1)
				}
			}
		} catch (e) {
			console.log(e)
		}
	}
	setInterval(gameLoop.bind(this), 30)
};
module.exports = exports = Game