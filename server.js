


const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const PORT = process.env.PORT || 3000;

const INDEX = path.join(__dirname, 'client/index.html');
const server = express()
    .use(express.static('client'), (req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
const websocketServer = new SocketServer({ server });

var players = [];
var grids = [];



var map1 = [
	2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, 
	2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, 
	2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,2,2, 
	2,2,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,2,2, 
	2,2,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,2,2, 
	2,2,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2, 
	2,2,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,2,2, 
	2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,2,2, 
	2,2,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,2,2, 
	2,2,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,2,2, 
	2,2,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2,2, 
	2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2, 
	2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
	2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
];



var gridRowLength = 25;
//Create 50x50 grid map
for (var i=0; i<gridRowLength; i++) {
	for (var j=0; j<gridRowLength; j++) {
		grids.push(new Grid(j*100, i*100));
	}
}










	

	

websocketServer.on('connection', (ws) => {
    ws.on('close', function() {
    	for (var i=0; i<players.length; i++) {
    		if (players[i].ws == ws) {
    			console.log('closing: ' + i);
    			players.splice(i, 1);
    			return;
    		}
    	}
    });
    ws.on('error', function() {
    	for (var i=0; i<players.length; i++) {
    		if (players[i].ws == ws) {
    			console.log('ERRORR: ' + i);
    			players.splice(i, 1);
    			return;
    		}
    	}
	});

    //Create new objects for new player
    players.push(new Player(ws));

    //Send new player all map and player info
    ws.send(JSON.stringify({
        type: 'initPlayer',
        player: [players[players.length-1].x, players[players.length-1].y, players[players.length-1].id],
        grids: grids
    }));

	ws.on('message', function(e) {
        try {
	        var message = JSON.parse(e);
	        var messageIndex;
        	for (var i=0; i<players.length; i++) {
        		if (players[i].id == message.id) {
        			messageIndex = i;
        			break;
        		}
        	}

	        if (message.type == 'playerMove') {
    			players[messageIndex].move = message.move;
	        }
	        else if (message.type == 'boost') {
	        	players[messageIndex].moveSpeed = .75;
		        	players[messageIndex].velX *= 2;
		        	players[messageIndex].velY *= 2;

	        	setTimeout(function() {
		        	players[messageIndex].moveSpeed = .25;
	        	},500);
	        }
        }
		catch (e) {
            console.log(e);
        }
    });
});









setInterval(function() {
	try {
		var minimizedPlayers = [];

	console.log(Math.round(players[0].velX) + ' ' + Math.round(players[0].velY));

		for (var i=0; i<players.length; i++) {
			players[i].update();

			minimizedPlayers.push([players[i].x.toFixed(2), players[i].y.toFixed(2), players[i].color]);
		}

		for (var i=0; i<players.length; i++) {
		    if (players[i].ws.readyState === players[i].ws.OPEN) {
		    	players[i].ws.send(JSON.stringify({
		        	type: 'gameUpdate',
		        	x: players[i].x.toFixed(2),
		        	y: players[i].y.toFixed(2),
		        	players: minimizedPlayers
		    	}));
		    }
		    else {
		    	console.log('delete 1 player jasljdajlksfjlkafjlkajlkfjlkfjlkasljkfljskfljkfljkasjkfjlafjlkaf');
		    	players.splice(i, 1);
		    }
		}
	}
	catch (e) {
		console.log(e);
	}
},30);









function Player(ws) {
	this.x = gridRowLength*50;
	this.y = gridRowLength*50;
	this.velX = 0;
	this.velY = 0;
	this.move = [0, 0, 0, 0];
	this.team = Math.round(Math.random());
	this.id = Math.random();
	this.ws = ws;
	this.moveSpeed = .25;
	var teamColor = this.team == 1 ? 240 : 0;
	this.color = 'hsl(' + teamColor + ',' + Math.floor(Math.random()*60+40) + '%,' + Math.floor(Math.random()*40+20) + '%)';
}

Player.prototype.update = function() {
	this.collision();

	if (this.velX<15 && this.velX>-15) {
		this.move[3] ? this.velX-=this.moveSpeed : 0;
		this.move[1] ? this.velX+=this.moveSpeed : 0;
	}
	if (this.velY<15 && this.velY>-15) {
		this.move[0] ? this.velY-=this.moveSpeed : 0;
		this.move[2] ? this.velY+=this.moveSpeed : 0;
	}

	this.x += this.velX;
	this.y += this.velY;

	this.velX *= .97;
	this.velY *= .97;
}

Player.prototype.reset = function() {
	this.x = 250;
	this.y = 250;
	this.velX = 0;
	this.velY = 0;
}

Player.prototype.collision = function() {
	try {
		var currentGrid = Math.floor(this.x/100) + Math.floor(this.y/100)*gridRowLength;

		var collideGrids = [currentGrid-gridRowLength-1, currentGrid-gridRowLength, currentGrid-gridRowLength+1,
							currentGrid-1, currentGrid, currentGrid+1,
							currentGrid+gridRowLength-1, currentGrid+gridRowLength, currentGrid+gridRowLength+1];

		for (var i=0; i<collideGrids.length; i++) {
			if (grids[collideGrids[i]].type == 1 || grids[collideGrids[i]].type == 2) {
				var a = circRectCollision(this, grids[collideGrids[i]]);

				if (a == 'X') {
					var xLeftWall = this.x-grids[collideGrids[i]].x;
					var xRightWall = grids[collideGrids[i]].x+100-this.x;
					xLeftWall < xRightWall ? this.velX = -this.velX-1 : this.velX = -this.velX+1;
					break;
				}
				else if (a == 'Y') {
					var yTopWall = this.y-grids[collideGrids[i]].y;
					var yBottomWall = grids[collideGrids[i]].y+100-this.y;
					yTopWall < yBottomWall ? this.velY = -this.velY-1 : this.velY = -this.velY+1;
					break;
				}
				else if (a == true) {
					var xLeftWall = this.x-grids[collideGrids[i]].x;
					var xRightWall = grids[collideGrids[i]].x+100-this.x;

					var yTopWall = this.y-grids[collideGrids[i]].y;
					var yBottomWall = grids[collideGrids[i]].y+100-this.y;

					if (Math.min(xLeftWall, xRightWall) < Math.min(yTopWall, yBottomWall)) {
						xLeftWall < xRightWall ? this.velX = -this.velX-1 : this.velX = -this.velX+1;
						break;
					}
					else if (Math.min(xLeftWall, xRightWall) > Math.min(yTopWall, yBottomWall)) {
						yTopWall < yBottomWall ? this.velY = -this.velY-1 : this.velY = -this.velY+1;
						break;
					}
				}
			}
		}
		//Collide with player
		for (var i=0; i<players.length; i++) {
			if (players[i].id != this.id && players[i].team != this.team) {
				var distance = Math.sqrt(((this.x - players[i].x) * (this.x - players[i].x))+ ((this.y - players[i].y) * (this.y - players[i].y)));
				distance < 70 ? c2c(this, players[i]) : 0;
			}
		}
	}
	catch (e) {
		this.reset();
		console.log(e);
	}
}















function circRectCollision(player,rect){
    var distX = Math.abs(player.x - rect.x - 100/2);
    var distY = Math.abs(player.y - rect.y - 100/2);

    if (distX > (100/2 + 30)) { return false; }
    if (distY > (100/2 + 30)) { return false; }

    if (distX <= (100/2)) { return 'Y'; } 
    if (distY <= (100/2)) { return 'X'; }

    // also test for corner collisions
    var dx=distX-100/2;
    var dy=distY-100/2;
    return (dx*dx+dy*dy<=(30*30));
}

function c2c(p1, p2) {
	dx = p1.x-p2.x;
    dy = p1.y-p2.y;
    collisionision_angle = Math.atan2(dy, dx);
    p1Mag = Math.sqrt(p1.velX*p1.velX+p1.velY*p1.velY);
    p2Mag = Math.sqrt(p2.velX*p2.velX+p2.velY*p2.velY);
    p1Dir = Math.atan2(p1.velY, p1.velX);
    p2Dir = Math.atan2(p2.velY, p2.velX);
    p1VelX = p1Mag*Math.cos(p1Dir-collisionision_angle);
    p1VelY = p1Mag*Math.sin(p1Dir-collisionision_angle);
    p2VelX = p2Mag*Math.cos(p2Dir-collisionision_angle);
    p2VelY = p2Mag*Math.sin(p2Dir-collisionision_angle);
    final_velX_1 = ((200-200)*p1VelX+(200+200)*p2VelX)/(200+200);
    final_velX_2 = ((200+200)*p1VelX+(200-200)*p2VelX)/(200+200);
    final_velY_1 = p1VelY;
    final_velY_2 = p2VelY;
    p1.velX = (Math.cos(collisionision_angle)*final_velX_1+Math.cos(collisionision_angle+Math.PI/2)*final_velY_1) * .99;
    p1.velY = (Math.sin(collisionision_angle)*final_velX_1+Math.sin(collisionision_angle+Math.PI/2)*final_velY_1) * .99;
    p2.velX = (Math.cos(collisionision_angle)*final_velX_2+Math.cos(collisionision_angle+Math.PI/2)*final_velY_2) * .99;
    p2.velY = (Math.sin(collisionision_angle)*final_velX_2+Math.sin(collisionision_angle+Math.PI/2)*final_velY_2) * .99;
    p1.x += p1.velX; 
    p1.y += p1.velY; 
    p2.x += p2.velX; 
    p2.y += p2.velY; 
}


















function Grid(x, y) {
	this.x = x;
	this.y = y;
	this.type = isWall(this);

}

function isWall(grid) {
	//Use manually created map
	return map1[grids.length];

	//Use randomly generated map
	// return grid.x == 0 || grid.x == 100 || 
	// grid.x == (gridRowLength-1)*100 || grid.x == (gridRowLength-1)*100-100 || 
	// grid.y == 0 || grid.y == 100 ||
	// grid.y == (gridRowLength-1)*100 || grid.y == (gridRowLength-1)*100-100 ? 1 : Math.round(Math.random()*100)+1 <= 16 ? 1 : 0;
}




