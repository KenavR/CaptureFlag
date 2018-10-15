var HOST = location.origin.replace(/^http/, 'ws');

//Online
var ws = new WebSocket(HOST);

var canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

var keyStates = [];
var player;
var grids = [];
var gridRowLength;










ws.onmessage = function(e) {
    var message = JSON.parse(e.data);

    if (message.type == 'gameUpdate') {
        player.x = Number(message.x);
        player.y = Number(message.y);

        //Move camera view to center with player
        ctx.setTransform(1, 0, 0, 1, -player.x + canvas.width / 2, -player.y + canvas.height / 2);
        ctx.clearRect(player.x-canvas.width/2, player.y-canvas.height/2, canvas.width, canvas.height);

        //Draw all players within viewport
        for (var i=0; i<message.players.length; i++) {
            draw(message.players[i][0], message.players[i][1], message.players[i][2]);
        }

        //Only show grids within viewing range
        player.currentGrid = Math.floor(player.x/100) + Math.floor(player.y/100)*gridRowLength;

        var viewStartGrid = player.currentGrid - Math.floor(canvas.width/2/100) - Math.floor(canvas.height/2/100)*gridRowLength-1 >= 0 ? player.currentGrid - Math.floor(canvas.width/2/100) - Math.floor(canvas.height/2/100)*gridRowLength-1 : 0;
        var viewEndGrid = player.currentGrid + Math.ceil(canvas.width/2/100) + Math.ceil(canvas.height/2/100)*gridRowLength+1 < grids.length ? player.currentGrid + Math.ceil(canvas.width/2/100) + Math.ceil(canvas.height/2/100)*gridRowLength+1 : grids.length;

        console.log(viewEndGrid);

        for (var i=viewStartGrid; i<viewEndGrid; i++) {
            try {
                if (Math.abs(grids[player.currentGrid].x-grids[i].x) < canvas.width/2+100 && Math.abs(grids[player.currentGrid].y-grids[i].y) < canvas.height/2+100 && grids[i].type > 0) {
                    grids[i].type > 0 ? drawGrids(grids[i].x, grids[i].y, grids[i].type) : 0;
                }
            }
            catch(e) {
                // console.log(i);
            }
        }
    }

    //This client just joined
    else if (message.type == 'initPlayer') {
        player.x = message.player[0];
        player.y = message.player[1];
        player.id = message.player[2];
        grids = message.grids;

        for (var i=0; i<grids.length; i++) {
            if (grids[i].y > 0) {
                gridRowLength = i;
                break;
            }
        }
    }
}










var player = {
    x: 0,
    y: 0,
    id: 0,
    move: [0, 0, 0, 0],
    updated: false,
    currentGrid: 0
}










ctx.lineWidth = 1;

function draw(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawGrids(x, y, type) {
    //Wall
    if (type == 1) {
        ctx.beginPath();
        ctx.rect(x+5, y+5, 90, 90);
        ctx.fillStyle = 'rgba(0,0,0,.75)';
        ctx.fill();
    }
}










window.addEventListener('keydown', function(e) {
    player.updated = true;
    [87, 38].indexOf(e.keyCode) > -1 ? player.move[0] = 1 : 0;
    [68, 39].indexOf(e.keyCode) > -1 ? player.move[1] = 1 : 0;
    [83, 40].indexOf(e.keyCode) > -1 ? player.move[2] = 1 : 0;
    [65, 37].indexOf(e.keyCode) > -1 ? player.move[3] = 1 : 0;

    ws.send(JSON.stringify({
        type: 'playerMove',
        move: player.move,
        id: player.id
    }));

});

window.addEventListener('keyup', function(e) {
    player.updated = true;
    [87, 38].indexOf(e.keyCode) > -1 ? player.move[0] = 0 : 0;
    [68, 39].indexOf(e.keyCode) > -1 ? player.move[1] = 0 : 0;
    [83, 40].indexOf(e.keyCode) > -1 ? player.move[2] = 0 : 0;
    [65, 37].indexOf(e.keyCode) > -1 ? player.move[3] = 0 : 0;

    ws.send(JSON.stringify({
        type: 'playerMove',
        move: player.move,
        id: player.id
    }));
});