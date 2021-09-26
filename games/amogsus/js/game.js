const args = [];
function arg(key, value) {
    this.key = key;
    this.value = value;
}
function setArgs() {
    let loc = window.location.href;
    if(loc.includes("?")) {
        let s = loc.split("?")[1];
        if(s.includes("=")) {
            if(s.includes("&")) {
                s.split("&").forEach((e, i) => {
                    let sp = e.split("=");
                    args[i] = new arg(sp[0], sp[1]);
                });
            } else {
                let sp = s.split("=");
                if(sp[0].includes("nick")) args[0] = new arg(sp[0], sp[1]);
            }
        }
    }
}
setArgs();

const canvas = document.querySelector(".particles");
const c = canvas.getContext("2d");
const MOVE_FRAMES = 5, STAND_FRAMES = 3;
var width, height;
var keysDown = [];
var players = [];

/*
* SERVER VARIABLES
*/
var serverSpeed = 20;
var serverLobby = true;

/*
* TEXTURES
*/
var textures = [];
var map = new Image();
map.src = "../textures/map.png";
var lobby = new Image();
lobby.src = "../textures/lobby.png";

function onload() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createPlayer(args[0].value);
    createPlayer("lmao");
    players[1].pos = [2048, 2048];
    players[0].pos[0] = -width/2+30+2048;
    players[0].pos[1] = -height/2+30+2048;
    for(let i = 0; i < 10; i++) {
        new texture("player:" + i, "../models/" + i + ".png");
        for(let i2 = 0; i2 < 4; i2++) {
            new texture("player_standing:" + i + "/" + i2, "../models/standing/" + i + "/" + i2 + ".png");
        }
    }
}

function tick() {
    if(contains(keysDown, "a")) {
        players[0].rotation[0] = -1;
        players[0].pos[0]-=serverSpeed;
    }
    if(contains(keysDown, "d")) {
        players[0].rotation[0] = 1;
        players[0].pos[0]+=serverSpeed;
    }
    if(contains(keysDown, "w")) {
        players[0].pos[1]-=serverSpeed;
    }
    if(contains(keysDown, "s")) {
        players[0].pos[1]+=serverSpeed;
    }

    c.clearRect(0, 0, width, height);

    c.save();
    c.scale(2, 2);
    c.drawImage(serverLobby ? lobby : map, -players[0].pos[0]/2, -players[0].pos[1]/2, 2048, 2048);
    c.restore();

    players[0].draw(true);
    players[0].tick();
    for(let i = 1; i < players.length; i++) {
        let p = players[i];
        p.draw(false);
        p.tick();
    }

    if(!serverLobby) {
        c.save();
        c.fillRect(8, 8, width/10+4, width/10+4);
        c.drawImage(map, 10, 10, width/10, width/10);
        //MAX 4096
        let x = (players[0].pos[0]/4096)*width/10+55;
        let y = (players[0].pos[1]/4096)*width/10+30;
        c.fillStyle = "white";
        c.fillRect(x, y, 10, 10);
        c.restore();
    }
}

function keyDown(event) {
    if(!contains(keysDown, event.key) && event.key.length == 1) keysDown[keysDown.length] = event.key;
}

function keyUp(event) {
    keysDown = removeTable(keysDown, event.key);
}

function Player(nick, color) {
    this.nick = nick;
    this.color = color;
    this.pos = [0, 0];
    this.rotation = [1, 1];
    this.moving = false;
    this.impostor = false;
    this.ghost = false;

    this.moveFrame = rand(0, 3);
    this.standFrame = rand(0, 3);
    this.ticksElapsed = 0;
    this.tick = function() {
        this.ticksElapsed++;
        if(this.ticksElapsed >= secondsToTicks(0.25)) {
            this.ticksElapsed = 0;
            if(this.moving) {
                this.moveFrame++;
                if(this.moveFrame > MOVE_FRAMES) this.moveFrame = 0;
            } else {
                this.standFrame++;
                if(this.standFrame > STAND_FRAMES) this.standFrame = 0;
            }
        }
    }
    this.draw = function(mid) {
        c.save();
        c.font = "30px VT323";
        c.textAlign = "center";
        c.fillStyle = "white";
        if(mid) {
            c.fillText(this.nick, width/2, height/2-50);
            c.translate(this.rotation[0] == 1 ? width/2-50 : width/2+50, height/2-50)
        } else {
            let mapX = -players[0].pos[0], mapY = -players[0].pos[1];
            c.fillText(this.nick, mapX+this.pos[0], mapY+this.pos[1]-50);
            c.translate(this.rotation[0] == 1 ? mapX+this.pos[0]-50 : mapX+this.pos[0]+50, mapY+this.pos[1]-50);
        }
        
        let frame = this.moving ? this.moveFrame : this.standFrame;
        c.scale(this.rotation[0], this.rotation[1]);
        c.drawImage(getTexture("player_standing:" + this.color + "/" + frame).loc, 0, 0, 100, 100);
        c.restore();
    }
}

function createPlayer(nick) {
    players[players.length] = new Player(nick, rand(0, 9));
}

function secondsToTicks(sec) {
    return sec*20;
}

function texture(name, location) {
    let i = new Image();
    i.src = location;
    this.name = name;
    this.loc = i;
    textures[textures.length] = this;
}
function getTexture(name) {
    let r = null;
    textures.forEach((e) => {
        if(e.name == name) r = e;
    });
    return r;
}

setInterval(() => { tick(); }, 50);
document.addEventListener("keydown", (event) => {
    keyDown(event);
})
document.addEventListener("keyup", (event) => {
    keyUp(event);
})