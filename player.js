const DEFAULTS = require("./defaults");

function Player(ws) {
	this.team = 0;
	this.x;
	this.y;
	this.velX = 0;
	this.velY = 0;
	this.move = [0, 0, 0, 0];
	this.id = Math.random();
	this.ws = ws;
	this.moveSpeed = .45;
	this.hasFlag = 0;
	this.reset();
	// Added game property to access the required properties that are now in the Game object
	this.game = null;
}

Player.prototype.setPlayedGame = function setPlayedGame(game) {
	this.game = game;
	this.getTeam();
};

Player.prototype.getTeam = function() {
	var redTeamPlayers = 0;
	var blueTeamPlayers = 0;
	if (this.game.hasOwnProperty('players')) {
		for (var i = 0; i < this.game.players.length; i++) {
			!this.game.players[i].team ? redTeamPlayers++ : blueTeamPlayers++;
		}
	}
	this.team = redTeamPlayers > blueTeamPlayers ? 1 : 0;
	console.log(redTeamPlayers + ' ' + blueTeamPlayers);
}

Player.prototype.update = function() {
	this.collision();
	if (this.velX < 50 && this.velX > -50) {
		this.move[3] ? (this.velX -= this.moveSpeed) : 0;
		this.move[1] ? (this.velX += this.moveSpeed) : 0;
	}
	if (this.velY < 50 && this.velY > -50) {
		this.move[0] ? (this.velY -= this.moveSpeed) : 0;
		this.move[2] ? (this.velY += this.moveSpeed) : 0;
	}

	this.x += this.velX;
	this.y += this.velY;

	this.velX *= 1;
	this.velY *= 1;
};

Player.prototype.reset = function() {
	try {
		if (this.game) {

			var spawnPoints = [];

			//Get spot to spawn
			for (var i = 0; i < this.game.map.length; i++) {
				if (this.game.map[i] == 8 && this.team == 0) {
					spawnPoints.push(i);
				} else if (this.game.map[i] == 9 && this.team == 1) {
					spawnPoints.push(i);
				}
			}

			if (this.hasFlag) {
				this.hasFlag = 0;
				if (!this.team) {
					this.game.grids[this.game.blueFlagSpawn].flagMessage(1);
					// this.game.grids[this.game.blueFlagSpawn].flag = 1;
					console.log('ded, returning blue flag' + this.hasFlag);
				} else {
					this.game.grids[this.game.redFlagSpawn].flagMessage(1);
					// this.game.grids[this.game.redFlagSpawn].flag = 1;
					console.log('ded, returning red flag' + this.hasFlag);
				}
			}

			var spawn = Math.round(Math.random() * spawnPoints.length);
			this.x = this.game.grids[spawnPoints[spawn]].x + 50;
			this.y = this.game.grids[spawnPoints[spawn]].y + 50;
			this.velX = 0;
			this.velY = 0;
		}
	} catch (e) {
		console.log(e);
		console.log("resetting error, trying again-----------------------");
		this.reset();
	}
};

Player.prototype.collision = function() {
	if (this.game) {
		try {
			var currentGrid = Math.floor(this.x / 100) + Math.floor(this.y / 100) * DEFAULTS.GridRowLength;

			var collideGrids = [
				currentGrid - DEFAULTS.GridRowLength - 1, currentGrid - DEFAULTS.GridRowLength, currentGrid - DEFAULTS.GridRowLength + 1,
				currentGrid - 1, currentGrid, currentGrid + 1,
				currentGrid + DEFAULTS.GridRowLength - 1, currentGrid + DEFAULTS.GridRowLength, currentGrid + DEFAULTS.GridRowLength + 1
			];

			for (var i = 0; i < collideGrids.length; i++) {
				//Circle to rect collision
				if (this.game.grids[collideGrids[i]] && (this.game.grids[collideGrids[i]].type == 1 || this.game.grids[collideGrids[i]].type == 2 || (this.game.grids[collideGrids[i]].type == 5 && this.game.grids[collideGrids[i]].team == this.team && !this.hasFlag))) {
					var collide = circRectCollision(this, this.game.grids[collideGrids[i]]);

					if (collide == "X") {
						var xLeftWall = this.x - this.game.grids[collideGrids[i]].x;
						var xRightWall = this.game.grids[collideGrids[i]].x + 100 - this.x;
						xLeftWall < xRightWall ? (this.velX = -this.velX * .95 - 1) : (this.velX = -this.velX + 1);
						break;
					} else if (collide == "Y") {
						var yTopWall = this.y - this.game.grids[collideGrids[i]].y;
						var yBottomWall = this.game.grids[collideGrids[i]].y + 100 - this.y;
						yTopWall < yBottomWall ? (this.velY = -this.velY * .95 - 1) : (this.velY = -this.velY + 1);
						break;
					} else if (collide == true) {
						var xLeftWall = this.x - this.game.grids[collideGrids[i]].x;
						var xRightWall = this.game.grids[collideGrids[i]].x + 100 - this.x;

						var yTopWall = this.y - this.game.grids[collideGrids[i]].y;
						var yBottomWall = this.game.grids[collideGrids[i]].y + 100 - this.y;

						if (Math.min(xLeftWall, xRightWall) < Math.min(yTopWall, yBottomWall)) {
							xLeftWall < xRightWall ? (this.velX = -this.velX * .95 - 1) : (this.velX = -this.velX * .95 + 1);
						} else if (Math.min(xLeftWall, xRightWall) > Math.min(yTopWall, yBottomWall)) {
							yTopWall < yBottomWall ? (this.velY = -this.velY * .95 - 1) : (this.velY = -this.velY * .95 + 1);
						}
						break;
					}
				}
				//Circle to circle collision
				else if (this.game.grids[collideGrids[i]] && this.game.grids[collideGrids[i]].type == 3 || this.game.grids[collideGrids[i]].type == 5) {
					var dist = Math.hypot(this.game.grids[collideGrids[i]].x + 50 - this.x, this.game.grids[collideGrids[i]].y + 50 - this.y);

					if (dist < 60) {
						if (this.game.grids[collideGrids[i]].type == 5) {
							this.game.grids[collideGrids[i]].flagCapture(this);
						} else if (this.game.grids[collideGrids[i]].type == 3) {
							this.reset();
						}
					}
				}
				//Boost pad
				else if (this.game.grids[collideGrids[i]].type > 4 && this.game.grids[collideGrids[i]].type < 5) {
					var collide = circRectCollision(this, this.game.grids[collideGrids[i]]);

					if (collide) {
						this.game.grids[collideGrids[i]].type == 4.1 ? this.velY -= .6 :
							this.game.grids[collideGrids[i]].type == 4.2 ? this.velX += .6 :
							this.game.grids[collideGrids[i]].type == 4.3 ? this.velY += .6 :
							this.game.grids[collideGrids[i]].type == 4.4 ? this.velX -= .6 : 0;
					}
				}
			}
			//Collide with player
			for (var i = 0; i < this.game.players.length; i++) {
				if (this.game.players[i].id != this.id && this.game.players[i].team != this.team) {
					var distance = Math.sqrt((this.x - this.game.players[i].x) * (this.x - this.game.players[i].x) + (this.y - this.game.players[i].y) * (this.y - this.game.players[i].y));

					if (distance <= 60 && !this.game.players[i].hasFlag && !this.hasFlag) {
						c2c(this, this.game.players[i]);
					} else if (distance <= 65 && this.game.players[i].hasFlag) {
						this.game.players[i].reset();
						this.hasFlag ? this.reset : 0;
					} else if (distance <= 65 && this.hasFlag) {
						this.reset();
						this.game.players[i].hasFlag ? this.game.players[i].reset() : 0;
					}
				}
			}
		} catch (e) {
			this.reset();
			console.log(e);
		}
	}
};









function c2c(p1, p2) {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;
	const collisionision_angle = Math.atan2(dy, dx);
	const p1Mag = Math.sqrt(p1.velX * p1.velX + p1.velY * p1.velY);
	const p2Mag = Math.sqrt(p2.velX * p2.velX + p2.velY * p2.velY);
	const p1Dir = Math.atan2(p1.velY, p1.velX);
	const p2Dir = Math.atan2(p2.velY, p2.velX);
	const p1VelX = p1Mag * Math.cos(p1Dir - collisionision_angle);
	const p1VelY = p1Mag * Math.sin(p1Dir - collisionision_angle);
	const p2VelX = p2Mag * Math.cos(p2Dir - collisionision_angle);
	const p2VelY = p2Mag * Math.sin(p2Dir - collisionision_angle);
	const final_velX_1 =
		((200 - 200) * p1VelX + (200 + 200) * p2VelX) / (200 + 200);
	const final_velX_2 =
		((200 + 200) * p1VelX + (200 - 200) * p2VelX) / (200 + 200);
	const final_velY_1 = p1VelY;
	const final_velY_2 = p2VelY;
	p1.velX =
		(Math.cos(collisionision_angle) * final_velX_1 +
			Math.cos(collisionision_angle + Math.PI / 2) * final_velY_1) *
		0.99;
	p1.velY =
		(Math.sin(collisionision_angle) * final_velX_1 +
			Math.sin(collisionision_angle + Math.PI / 2) * final_velY_1) *
		0.99;
	p2.velX =
		(Math.cos(collisionision_angle) * final_velX_2 +
			Math.cos(collisionision_angle + Math.PI / 2) * final_velY_2) *
		0.99;
	p2.velY =
		(Math.sin(collisionision_angle) * final_velX_2 +
			Math.sin(collisionision_angle + Math.PI / 2) * final_velY_2) *
		0.99;
	p1.x += p1.velX;
	p1.y += p1.velY;
	p2.x += p2.velX;
	p2.y += p2.velY;
}



function circRectCollision(player, rect) {
	var distX = Math.abs(player.x - rect.x - 100 / 2);
	var distY = Math.abs(player.y - rect.y - 100 / 2);

	if (distX > 100 / 2 + 20) {
		return false;
	}
	if (distY > 100 / 2 + 20) {
		return false;
	}

	if (distX <= 100 / 2) {
		return "Y";
	}
	if (distY <= 100 / 2) {
		return "X";
	}

	// also test for corner collisions
	var dx = distX - 100 / 2;
	var dy = distY - 100 / 2;
	return dx * dx + dy * dy <= 18 * 18;
}









module.exports = exports = Player;