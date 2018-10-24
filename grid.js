const DEFAULTS = require("./defaults");

function Grid(x, y, type, game) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.type == 5 ? (this.flag = 1) : 0;
	if (this.flag) {
		this.team = x < Math.round(DEFAULTS.GridRowLength * 100 / 2) ? 1 : 0;
	}
	this.game = game;
}

Grid.prototype.flagCapture = function(player) {
	//Flag was taken from spawn spot
	if (this.x > this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && player.team || this.x < this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && !player.team) {
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

	//Flag captured
	else if (this.x < this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && player.team || this.x > this.game.grids[Math.round(DEFAULTS.GridRowLength / 2)].x && !player.team) {
		if (player.hasFlag) {
			player.hasFlag = 0;
			this.team ? this.game.score[1]++ : this.game.score[0]++;
			this.team ? this.game.grids[this.game.redFlagSpawn].flag = 1 : this.game.grids[this.game.blueFlagSpawn].flag = 1;
			this.team ? this.game.grids[this.game.redFlagSpawn].flagMessage(1, this.game.score) : this.game.grids[this.game.blueFlagSpawn].flagMessage(1, this.game.score);
		}
	}
};

Grid.prototype.flagMessage = function(flag, score) {
	var currentGrid = Math.floor(this.x / 100) + Math.floor(this.y / 100) * DEFAULTS.GridRowLength;
	for (var i = 0; i < this.game.players.length; i++) {
		if (this.game.players[i].ws.readyState === this.game.players[i].ws.OPEN) {
			flag == 0 || flag == 1 ? this.flag = flag : 0;

			this.game.players[i].ws.send(
				JSON.stringify({
					type: "flagUpdate",
					index: currentGrid,
					hasFlag: this.flag,
					score: score
				})
			);
		}
	}
};

module.exports = exports = Grid;