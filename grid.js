const DEFAULTS = require("./defaults");

function Grid(x, y, type, game) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.type == 5 ? (this.flag = 1) : 0;
	this.game = game;
}

Grid.prototype.flagCapture = function(player) {
	//Blue captures red's flag
	if (this.x > this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && player.team) {
		for (var i = 0; i < this.game.players.length; i++) {
			if (this.game.players[i].team && this.game.players[i].hasFlag) {
				break;
			}
		}
		player.hasFlag = true;
		if (this.flag) {
			this.flag = 0;
			this.flagMessage(0);
		}
	}
	//Red captures blue's flag
	else if (this.x < this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && !player.team) {
		for (var i = 0; i < this.game.players.length; i++) {
			if (!this.game.players[i].team && this.game.players[i].hasFlag) {
				break;
			}
		}
		player.hasFlag = true;
		if (this.flag) {
			this.flagMessage(0);
			this.flag = 0;
		}
	}
	//Blue returns red's flag to base
	else if (this.x < this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && player.team) {
		if (player.hasFlag) {
			console.log('blue took flag capture ASDASD');
			player.hasFlag = 0;
			this.game.grids[this.game.redFlagSpawn].flag = 1;
			console.log(this.game.grids[this.game.redFlagSpawn]);
			this.game.grids[this.game.redFlagSpawn].flagMessage(1);
		}
	}
	//Red returns blue's flag to base
	else if (this.x > this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && !player.team) {
		if (player.hasFlag) {
			player.hasFlag = 0;
			this.game.grids[this.game.blueFlagSpawn].flag = 1;
			this.game.grids[this.game.blueFlagSpawn].flagMessage(1);
		}
	}
};

Grid.prototype.flagMessage = function(flag) {
	var currentGrid = Math.floor(this.x / 100) + Math.floor(this.y / 100) * DEFAULTS.GridRowLength;
	for (var i = 0; i < this.game.players.length; i++) {
		if (this.game.players[i].ws.readyState === this.game.players[i].ws.OPEN) {
			this.game.players[i].ws.send(
				JSON.stringify({
					type: "flagUpdate",
					index: currentGrid,
					hasFlag: flag
				})
			);
		} else {
			console.log("player readystaet not open? huh?");
		}
	}
};

module.exports = exports = Grid;