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
var grids = [];
var gridRowLength;
var boostReady = document.getElementById("boost");
var redGainedPoint = document.getElementById("redGainedPoint");
var blueGainedPoint = document.getElementById("blueGainedPoint");

var currentGameId = null;

var images = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];

images[0].src = "images/Wall.png";
images[1].src = "images/BorderWall.png";
images[2].src = "images/Spike.png";
images[3].src = "images/BoostUp.png";
images[4].src = "images/BoostRight.png";
images[5].src = "images/BoostDown.png";
images[6].src = "images/BoostLeft.png";
images[7].src = "images/RedPlayer.png";
images[8].src = "images/BluePlayer.png";
images[9].src = "images/RedFlag.png";
images[10].src = "images/BlueFlag.png";


var background = new Image();
background.src = "images/Background.png";

var player = {
	x: 0,
	y: 0,
	id: 0,
	move: [0, 0, 0, 0],
	updated: false,
	currentGrid: 0,
	viewStartGrid: 0,
	viewEndGrid: 0,
	boostReady: true,
	cameraX: 1250,
	cameraY: 1250
};

var oldPlayersPos = [
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0],
	[0, 0]
];
var message;









ws.onmessage = function(e) {
	message = JSON.parse(e.data);

	if (message.type == "gameUpdate") {
		currentGameId = !currentGameId && message.gameId ? message.gameId : currentGameId;
		player.x = Number(message.x);
		player.y = Number(message.y);

		//Determine which grids are in viewport range
		player.currentGrid = Math.floor(player.x / 100) + Math.floor(player.y / 100) * gridRowLength;

		player.viewStartGrid = player.currentGrid - Math.floor(canvas.width / 2 / 100) - Math.floor(canvas.height / 2 / 100) * gridRowLength - gridRowLength - 1 >= 0 ? player.currentGrid - Math.floor(canvas.width / 2 / 100) - Math.floor(canvas.height / 2 / 100) * gridRowLength - gridRowLength - 1 : 0;
		player.viewEndGrid = player.currentGrid + Math.ceil(canvas.width / 2 / 100) + Math.ceil(canvas.height / 2 / 100) * gridRowLength + 1 < grids.length ? player.currentGrid + Math.ceil(canvas.width / 2 / 100) + Math.ceil(canvas.height / 2 / 100) * gridRowLength + 1 : grids.length;

	} else if (message.type == "flagUpdate") {
		grids[message.index].flag = message.hasFlag;
		if (message.hasOwnProperty('flagCaptured')) {
			if (message.flagCaptured == 0) {
				document.getElementById('redScore').innerHTML++;
				redGainedPoint.style.animation = "none";
				redGainedPoint.offsetHeight;
				redGainedPoint.style.animation = null;
			} else if (message.flagCaptured == 1) {
				document.getElementById('blueScore').innerHTML++;
				blueGainedPoint.style.animation = "none";
				blueGainedPoint.offsetHeight;
				blueGainedPoint.style.animation = null;
			}
		}
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
		console.log('AYYY THIS BOI JUST JOIN');
		requestAnimationFrame(smoothDraw);
	}
};









function smoothDraw() {
	try {
		ctx.clearRect(player.cameraX - 25 - canvas.width / 2, player.cameraY - 25 - canvas.height / 2, canvas.width + 50, canvas.height + 50);
		//Move camera view to center with player
		var moveCameraX = (player.x - player.cameraX) * 0.2;
		var moveCameraY = (player.y - player.cameraY) * 0.2;
		player.cameraX += moveCameraX;
		player.cameraY += moveCameraY;

		ctx.setTransform(1, 0, 0, 1, -player.cameraX + canvas.width / 2, -player.cameraY + canvas.height / 2);

		Background();


		// Draw all grids in viewport range
		for (var i = player.viewStartGrid; i < player.viewEndGrid; i++) {
			if (Math.abs(grids[player.currentGrid].x - grids[i].x) < canvas.width / 2 + 100 && Math.abs(grids[player.currentGrid].y - grids[i].y) < canvas.height / 2 + 100 && grids[i].type > 0) {
				grids[i].type > 0 ?
					drawGrids(grids[i].x, grids[i].y, grids[i].type, grids[i].flag) : 0;
			}
		}
		//Draw and smooth player's movements
		for (var i = 0; i < message.players.length; i++) {
			var movePlayerX = (message.players[i][0] - oldPlayersPos[i][0]) * 0.4;
			var movePlayerY = (message.players[i][1] - oldPlayersPos[i][1]) * 0.4;

			oldPlayersPos[i][0] += movePlayerX;
			oldPlayersPos[i][1] += movePlayerY;

			drawPlayer(oldPlayersPos[i][0], oldPlayersPos[i][1], message.players[i][2], message.players[i][3]);
		}

		requestAnimationFrame(smoothDraw);

	} catch (e) {
		console.log(e);
	}
}







function Background() {
	ctx.fillStyle = ctx.createPattern(background, 'repeat');
	ctx.fillRect(player.cameraX - (canvas.width / 2), player.cameraY - (canvas.height / 2), canvas.width, canvas.height);
}

function drawImageLookat(img, x, y, lookx, looky) {
	ctx.setTransform(1, 0, 0, 1, x, y); // set scale and origin
	ctx.rotate(Math.atan2(looky - y, lookx - x)); // set angle
	ctx.drawImage(img, -img.width / 2, -img.height / 2); // draw image
	ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default not needed if you use setTransform for other rendering operations
}


// Math.atan2(5,5)*180/Math.PI; add angle arrow sometime
function drawPlayer(x, y, team, flag) {
	if (!team) {
		ctx.drawImage(images[7], x - 55, y - 55, 110, 110);
		flag ? ctx.drawImage(images[10], x - 45, y - 45, 90, 90) : 0;
	} else if (team) {
		ctx.drawImage(images[8], x - 55, y - 55, 110, 110);
		flag ? ctx.drawImage(images[9], x - 45, y - 45, 90, 90) : 0;
	}
}

function drawGrids(x, y, type, flag) {
	//Wall, Edge Wall, Spike, Boost
	if (type >= 1 && type <= 3) {
		ctx.drawImage(images[type - 1], x + 8, y + 8, 84, 84);
	} else if (type > 4 && type < 5) {
		var boostImg = type == 4.1 ? 3 : type == 4.2 ? 4 : type == 4.3 ? 5 : 6;
		ctx.drawImage(images[boostImg], x, y, 100, 100);
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
		x > Math.round(gridRowLength * 100 / 2) ? ctx.drawImage(images[9], x - 25, y - 20, 150, 150) : ctx.drawImage(images[10], x - 25, y - 25, 150, 150);
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