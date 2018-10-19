var HOST = location.origin.replace(/^http/, "ws");

//Online
var ws = new WebSocket(HOST);

var canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

window.addEventListener("resize", function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

var keyStates = [];
var player;
var grids = [];
var gridRowLength;
var boostReady = document.getElementById("boost");
var currentGameId = null;

var images = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];

images[0].src = "images/Wall.png";
images[1].src = "images/BorderWall.png";
images[2].src = "images/Spike.png";
images[3].src = "images/Boost.png";
images[4].src = "images/flagSpawn.png";
images[5].src = "images/RedPlayer.png";
images[6].src = "images/BluePlayer.png";
images[7].src = "images/RedFlag.png";
images[8].src = "images/BlueFlag.png";

var background = new Image();
background.src = "images/Background.png";

var player = {
	x: 0,
	y: 0,
	id: 0,
	move: [0, 0, 0, 0],
	updated: false,
	currentGrid: 0,
	boostReady: true,
	drawReady: true,
	cameraX: 0,
	cameraY: 0
};








ws.onmessage = function(e) {
	var message = JSON.parse(e.data);

	if (message.type == "gameUpdate" && player.drawReady) {
		player.drawReady = false;

		currentGameId = !currentGameId && message.gameId ? message.gameId : currentGameId;


		player.x = Number(message.x);
		player.y = Number(message.y);

		if (!player.cameraX) {
			console.log('init camera');
			player.cameraX = player.x;
			player.cameraY = player.y;

		}

		//Move camera view to center with player
		ctx.clearRect(player.x - canvas.width / 2, player.y - canvas.height / 2, canvas.width, canvas.height);

		//Determine which grids are in viewport range
		player.currentGrid = Math.floor(player.x / 100) + Math.floor(player.y / 100) * gridRowLength;

		var viewStartGrid = player.currentGrid - Math.floor(canvas.width / 2 / 100) - Math.floor(canvas.height / 2 / 100) * gridRowLength - gridRowLength - 1 >= 0 ? player.currentGrid - Math.floor(canvas.width / 2 / 100) - Math.floor(canvas.height / 2 / 100) * gridRowLength - gridRowLength - 1 : 0;
		var viewEndGrid = player.currentGrid + Math.ceil(canvas.width / 2 / 100) + Math.ceil(canvas.height / 2 / 100) * gridRowLength + 1 < grids.length ? player.currentGrid + Math.ceil(canvas.width / 2 / 100) + Math.ceil(canvas.height / 2 / 100) * gridRowLength + 1 : grids.length;

		Background();

		//Draw all grids in viewport range
		for (var i = viewStartGrid; i < viewEndGrid; i++) {
			try {
				if (Math.abs(grids[player.currentGrid].x - grids[i].x) < canvas.width / 2 + 100 && Math.abs(grids[player.currentGrid].y - grids[i].y) < canvas.height / 2 + 100 && grids[i].type > 0) {
					grids[i].type > 0 ?
						drawGrids(grids[i].x, grids[i].y, grids[i].type, grids[i].flag) : 0;
				}
			} catch (e) {
				console.log(e);
			}
		}

		//Draw all players within viewport
		for (var i = 0; i < message.players.length; i++) {
			drawPlayer(message.players[i][0], message.players[i][1], message.players[i][2], message.players[i][3]);
		}

		player.drawReady = true;
	} else if (message.type == "flagUpdate") {
		grids[message.index].flag = message.hasFlag;
	}

	//This client just joined
	else if (message.type == "initPlayer") {
		player.x = message.player[0];
		player.y = message.player[1];
		player.id = message.player[2];
		grids = message.grids;

		for (var i = 0; i < grids.length; i++) {
			if (grids[i].y > 0) {
				gridRowLength = i;
				break;
			}
		}
	}
};






function smoothDraw() {
	var moveX = (player.x - player.cameraX) * 0.3;
	var moveY = (player.y - player.cameraY) * 0.3;

	console.log(moveX + ' ' + moveY);

	player.cameraX += moveX;
	player.cameraY += moveY;

	//Move camera view to center with player
	ctx.setTransform(1, 0, 0, 1, -player.cameraX + canvas.width / 2, -player.cameraY + canvas.height / 2);

	requestAnimationFrame(smoothDraw);
}
requestAnimationFrame(smoothDraw);







function Background() {
	ctx.fillStyle = ctx.createPattern(background, 'repeat');
	ctx.fillRect(player.x - (canvas.width / 2), player.y - (canvas.height / 2), canvas.width, canvas.height);
}





// Math.atan2(5,5)*180/Math.PI; add angle arrow sometime
function drawPlayer(x, y, team, flag) {
	if (!team) {
		ctx.drawImage(images[5], x - 52.5, y - 52.5, 105, 105);
		flag ? ctx.drawImage(images[8], x - 45, y - 45, 90, 90) : 0;
	} else if (team) {
		ctx.drawImage(images[6], x - 52.5, y - 52.5, 105, 105);
		flag ? ctx.drawImage(images[7], x - 45, y - 45, 90, 90) : 0;
	}
}

function drawGrids(x, y, type, flag) {
	//Wall, Edge Wall, Spike, Boost
	if (type >= 1 && type <= 4) {
		ctx.drawImage(images[type - 1], x + 10, y + 10, 80, 80);
	}
	//Flag spawn points
	else if (type == 5) {
		ctx.beginPath();
		ctx.rect(x + 10, y + 10, 80, 80);
		ctx.fillStyle = x > grids[Math.round(gridRowLength / 2)].x ? "rgba(255,0,0,.25)" : "rgba(0,0,255,.25)";
		ctx.fill();
	}
	//Flag
	if (flag) {
		x > Math.round(gridRowLength * 100 / 2) ? ctx.drawImage(images[7], x - 25, y - 20, 150, 150) : ctx.drawImage(images[8], x - 25, y - 25, 150, 150);
	}
}

window.addEventListener("keydown", function(e) {
	player.updated = true;
	[87, 38].indexOf(e.keyCode) > -1 ? (player.move[0] = 1) : 0;
	[68, 39].indexOf(e.keyCode) > -1 ? (player.move[1] = 1) : 0;
	[83, 40].indexOf(e.keyCode) > -1 ? (player.move[2] = 1) : 0;
	[65, 37].indexOf(e.keyCode) > -1 ? (player.move[3] = 1) : 0;

	ws.send(
		JSON.stringify({
			gameId: currentGameId,
			type: "playerMove",
			move: player.move,
			id: player.id
		})
	);

	if (e.keyCode == 32) {
		if (player.boostReady) {
			player.boostReady = false;
			ws.send(
				JSON.stringify({
					gameId: currentGameId,
					type: "boost",
					id: player.id
				})
			);

			//Reset boost animation
			boostReady.style.animation = "none";
			boostReady.offsetHeight;
			boostReady.style.animation = null;

			setTimeout(function() {
				player.boostReady = true;
			}, 10000);
		}
	}
});

window.addEventListener("keyup", function(e) {
	player.updated = true;
	[87, 38].indexOf(e.keyCode) > -1 ? (player.move[0] = 0) : 0;
	[68, 39].indexOf(e.keyCode) > -1 ? (player.move[1] = 0) : 0;
	[83, 40].indexOf(e.keyCode) > -1 ? (player.move[2] = 0) : 0;
	[65, 37].indexOf(e.keyCode) > -1 ? (player.move[3] = 0) : 0;

	ws.send(
		JSON.stringify({
			gameId: currentGameId,
			type: "playerMove",
			move: player.move,
			id: player.id
		})
	);
});