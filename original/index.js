const express = require("express");
const SocketServer = require("ws").Server;
const path = require("path");
const PORT = process.env.PORT || 3000;

const INDEX = path.join(__dirname, "client/index.html");
const server = express()
  .use(express.static("client"), (req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const websocketServer = new SocketServer({ server });

var players = [];
var grids = [];

//0 = empty
//1 = wall
//2 = edge wall
//3 = team flag spawn
//4 = spike
//8 = red team spawn points
//9 = blue team spawn points
var map1 = [
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  8,
  0,
  8,
  0,
  8,
  2,
  4,
  4,
  2,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  1,
  0,
  8,
  0,
  8,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  8,
  0,
  3,
  0,
  8,
  2,
  4,
  4,
  2,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  8,
  0,
  8,
  0,
  2,
  4,
  4,
  2,
  0,
  4,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  4,
  1,
  8,
  0,
  8,
  2,
  4,
  4,
  2,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  4,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  4,
  0,
  4,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  4,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  2,
  4,
  4,
  2,
  9,
  0,
  9,
  1,
  4,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  4,
  0,
  2,
  4,
  4,
  2,
  0,
  9,
  0,
  9,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  2,
  4,
  4,
  2,
  9,
  0,
  3,
  0,
  9,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  0,
  9,
  0,
  9,
  0,
  1,
  0,
  0,
  0,
  0,
  4,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  4,
  0,
  2,
  4,
  4,
  2,
  9,
  0,
  9,
  0,
  9,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  4,
  4,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4
];
var redFlagSpawn = map1.indexOf(3);
var blueFlagSpawn = map1.indexOf(3, redFlagSpawn + 1);

var gridRowLength = 25;
//Create 50x50 grid map
for (var i = 0; i < gridRowLength; i++) {
  for (var j = 0; j < gridRowLength; j++) {
    grids.push(new Grid(j * 100, i * 100, map1[j + i * gridRowLength]));
  }
}

websocketServer.on("connection", ws => {
  ws.on("close", function() {
    for (var i = 0; i < players.length; i++) {
      if (players[i].ws == ws) {
        console.log("closing: " + i);
        players[i].reset();
        players.splice(i, 1);
        return;
      }
    }
  });
  ws.on("error", function() {
    for (var i = 0; i < players.length; i++) {
      if (players[i].ws == ws) {
        console.log("ERRORR: " + i);
        players[i].reset();
        players.splice(i, 1);
        return;
      }
    }
  });

  //Create new objects for new player
  players.push(new Player(ws));

  //Send new player all map and player info
  ws.send(
    JSON.stringify({
      type: "initPlayer",
      player: [
        players[players.length - 1].x,
        players[players.length - 1].y,
        players[players.length - 1].id
      ],
      grids: grids
    })
  );

  ws.on("message", function(e) {
    try {
      var message = JSON.parse(e);
      var messageIndex;
      for (var i = 0; i < players.length; i++) {
        if (players[i].id == message.id) {
          messageIndex = i;
          break;
        }
      }

      if (message.type == "playerMove") {
        players[messageIndex].move = message.move;
      } else if (message.type == "boost") {
        players[messageIndex].moveSpeed = 0.75;
        players[messageIndex].velX *= 2;
        players[messageIndex].velY *= 2;

        setTimeout(function() {
          players[messageIndex].moveSpeed = 0.2;
        }, 500);
      }
    } catch (e) {
      console.log(e);
    }
  });
});

setInterval(function() {
  try {
    var minimizedPlayers = [];

    for (var i = 0; i < players.length; i++) {
      players[i].update();

      minimizedPlayers.push([
        players[i].x.toFixed(2),
        players[i].y.toFixed(2),
        players[i].color
      ]);
      if (players[i].hasFlag) {
        minimizedPlayers[minimizedPlayers.length - 1].push(players[i].hasFlag);
      }
    }

    for (var i = 0; i < players.length; i++) {
      if (players[i].ws.readyState === players[i].ws.OPEN) {
        players[i].ws.send(
          JSON.stringify({
            type: "gameUpdate",
            x: players[i].x.toFixed(2),
            y: players[i].y.toFixed(2),
            players: minimizedPlayers
          })
        );
      } else {
        console.log(
          "setInterval delete 1 player jasljdajlksfjlkafjlkajlkfjlkfjlkasljkfljskfljkfljkasjkfjlafjlkaf"
        );
        players[i].reset();
        players.splice(i, 1);
      }
    }
  } catch (e) {
    console.log(e);
  }
}, 30);

function Player(ws) {
  this.team = Math.round(Math.random());
  this.x;
  this.y;
  this.velX = 0;
  this.velY = 0;
  this.move = [0, 0, 0, 0];
  this.id = Math.random();
  this.ws = ws;
  this.moveSpeed = 0.2;
  var teamColor = this.team == 1 ? 240 : 0;
  this.color =
    "hsla(" +
    teamColor +
    "," +
    Math.floor(Math.random() * 60 + 40) +
    "%," +
    Math.floor(Math.random() * 40 + 20) +
    "%, .8)";
  this.hasFlag = 0;
  this.reset();
}

Player.prototype.update = function() {
  this.collision();

  if (this.velX < 15 && this.velX > -15) {
    this.move[3] ? (this.velX -= this.moveSpeed) : 0;
    this.move[1] ? (this.velX += this.moveSpeed) : 0;
  }
  if (this.velY < 15 && this.velY > -15) {
    this.move[0] ? (this.velY -= this.moveSpeed) : 0;
    this.move[2] ? (this.velY += this.moveSpeed) : 0;
  }

  this.x += this.velX;
  this.y += this.velY;

  this.velX *= 0.97;
  this.velY *= 0.97;
};

Player.prototype.reset = function() {
  try {
    var spawnPoints = [];

    //Get spot to spawn
    for (var i = 0; i < map1.length; i++) {
      if (map1[i] == 8 && this.team == 0) {
        spawnPoints.push(i);
      } else if (map1[i] == 9 && this.team == 1) {
        spawnPoints.push(i);
      }
    }

    if (this.hasFlag) {
      this.hasFlag = 0;
      if (!this.team) {
        grids[blueFlagSpawn].flagMessage(1);
        grids[blueFlagSpawn].flag = 1;
      } else {
        grids[redFlagSpawn].flagMessage(1);
        grids[redFlagSpawn].flag = 1;
      }
    }

    var spawn = Math.round(Math.random() * spawnPoints.length);
    this.x = grids[spawnPoints[spawn]].x + 50;
    this.y = grids[spawnPoints[spawn]].y + 50;
    this.velX = 0;
    this.velY = 0;
  } catch (e) {
    console.log("resetting error, trying again");
    this.reset();
  }
};

Player.prototype.collision = function() {
  try {
    var currentGrid =
      Math.floor(this.x / 100) + Math.floor(this.y / 100) * gridRowLength;

    var collideGrids = [
      currentGrid - gridRowLength - 1,
      currentGrid - gridRowLength,
      currentGrid - gridRowLength + 1,
      currentGrid - 1,
      currentGrid,
      currentGrid + 1,
      currentGrid + gridRowLength - 1,
      currentGrid + gridRowLength,
      currentGrid + gridRowLength + 1
    ];

    for (var i = 0; i < collideGrids.length; i++) {
      //Circle to rect collision
      if (
        grids[collideGrids[i]].type == 1 ||
        grids[collideGrids[i]].type == 2
      ) {
        var collide = circRectCollision(this, grids[collideGrids[i]]);

        if (collide == "X") {
          var xLeftWall = this.x - grids[collideGrids[i]].x;
          var xRightWall = grids[collideGrids[i]].x + 100 - this.x;
          xLeftWall < xRightWall
            ? (this.velX = -this.velX - 1)
            : (this.velX = -this.velX + 1);
          break;
        } else if (collide == "Y") {
          var yTopWall = this.y - grids[collideGrids[i]].y;
          var yBottomWall = grids[collideGrids[i]].y + 100 - this.y;
          yTopWall < yBottomWall
            ? (this.velY = -this.velY - 1)
            : (this.velY = -this.velY + 1);
          break;
        } else if (collide == true) {
          var xLeftWall = this.x - grids[collideGrids[i]].x;
          var xRightWall = grids[collideGrids[i]].x + 100 - this.x;

          var yTopWall = this.y - grids[collideGrids[i]].y;
          var yBottomWall = grids[collideGrids[i]].y + 100 - this.y;

          if (
            Math.min(xLeftWall, xRightWall) < Math.min(yTopWall, yBottomWall)
          ) {
            xLeftWall < xRightWall
              ? (this.velX = -this.velX - 1)
              : (this.velX = -this.velX + 1);
          } else if (
            Math.min(xLeftWall, xRightWall) > Math.min(yTopWall, yBottomWall)
          ) {
            yTopWall < yBottomWall
              ? (this.velY = -this.velY - 1)
              : (this.velY = -this.velY + 1);
          }
          break;
        }
      }
      //Circle to circle collision
      else if (
        grids[collideGrids[i]].type == 3 ||
        grids[collideGrids[i]].type == 4
      ) {
        var dist = Math.hypot(
          grids[collideGrids[i]].x + 50 - this.x,
          grids[collideGrids[i]].y + 50 - this.y
        );

        if (dist < 60) {
          if (grids[collideGrids[i]].type == 3) {
            grids[collideGrids[i]].flagCapture(this);
          } else if (grids[collideGrids[i]].type == 4) {
            this.reset();
          }
        }
      }
    }
    //Collide with player
    for (var i = 0; i < players.length; i++) {
      if (players[i].id != this.id && players[i].team != this.team) {
        var distance = Math.sqrt(
          (this.x - players[i].x) * (this.x - players[i].x) +
            (this.y - players[i].y) * (this.y - players[i].y)
        );
        if (distance <= 60 && !players[i].hasFlag && !this.hasFlag) {
          c2c(this, players[i]);
        } else if (distance <= 65 && players[i].hasFlag) {
          players[i].reset();
        } else if (distance <= 65 && this.hasFlag) {
          this.reset();
        }
      }
    }
  } catch (e) {
    this.reset();
    console.log(e);
  }
};

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
  return dx * dx + dy * dy <= 20 * 20;
}

function c2c(p1, p2) {
  dx = p1.x - p2.x;
  dy = p1.y - p2.y;
  collisionision_angle = Math.atan2(dy, dx);
  p1Mag = Math.sqrt(p1.velX * p1.velX + p1.velY * p1.velY);
  p2Mag = Math.sqrt(p2.velX * p2.velX + p2.velY * p2.velY);
  p1Dir = Math.atan2(p1.velY, p1.velX);
  p2Dir = Math.atan2(p2.velY, p2.velX);
  p1VelX = p1Mag * Math.cos(p1Dir - collisionision_angle);
  p1VelY = p1Mag * Math.sin(p1Dir - collisionision_angle);
  p2VelX = p2Mag * Math.cos(p2Dir - collisionision_angle);
  p2VelY = p2Mag * Math.sin(p2Dir - collisionision_angle);
  final_velX_1 = ((200 - 200) * p1VelX + (200 + 200) * p2VelX) / (200 + 200);
  final_velX_2 = ((200 + 200) * p1VelX + (200 - 200) * p2VelX) / (200 + 200);
  final_velY_1 = p1VelY;
  final_velY_2 = p2VelY;
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

function Grid(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.type == 3 ? (this.flag = 1) : 0;
}
Grid.prototype.flagCapture = function(player) {
  //Blue captures red's flag
  if (this.x > grids[Math.round(gridRowLength / 2)].x && player.team) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].team && players[i].hasFlag) {
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
  else if (this.x < grids[Math.round(gridRowLength / 2)].x && !player.team) {
    for (var i = 0; i < players.length; i++) {
      if (!players[i].team && players[i].hasFlag) {
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
  else if (this.x < grids[Math.round(gridRowLength / 2)].x && player.team) {
    if (player.hasFlag) {
      player.hasFlag = 0;
      grids[redFlagSpawn].flag = 1;
      grids[redFlagSpawn].flagMessage(1);
    }
  }
  //Red returns blue's flag to base
  else if (this.x > grids[Math.round(gridRowLength / 2)].x && !player.team) {
    if (player.hasFlag) {
      player.hasFlag = 0;
      grids[blueFlagSpawn].flag = 1;
      grids[blueFlagSpawn].flagMessage(1);
    }
  }
};
Grid.prototype.flagMessage = function(flag) {
  var currentGrid =
    Math.floor(this.x / 100) + Math.floor(this.y / 100) * gridRowLength;
  for (var i = 0; i < players.length; i++) {
    if (players[i].ws.readyState === players[i].ws.OPEN) {
      players[i].ws.send(
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

// function isWall(grid) {
//Use manually created map
// return map1[grids.length];

//Use randomly generated map
// return grid.x == 0 || grid.x == 100 ||
// grid.x == (gridRowLength-1)*100 || grid.x == (gridRowLength-1)*100-100 ||
// grid.y == 0 || grid.y == 100 ||
// grid.y == (gridRowLength-1)*100 || grid.y == (gridRowLength-1)*100-100 ? 1 : Math.round(Math.random()*100)+1 <= 16 ? 1 : 0;
// }
