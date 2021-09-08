const canv = document.querySelector(".cv");
const c = canv.getContext("2d");
const game = document.querySelector(".game");
const loseScreen = document.querySelector(".lose");
const wonScreen = document.querySelector(".won");
const storage = localStorage;
var onPad = false;
var scores = [];
var balls = [];
var bullets = [];
const bW = 50, bH = 20;
var blocks = [];
var lost = false, won = false;
var extrass = [];

var bigBallEndTime = -1;
var gunEndTime = -1;

var leftDown = false, rightDown = false;

var padX = 0;

function resize() {
    canv.width = game.clientWidth;
    canv.height = game.clientHeight;
}

// INIT OF THE GAME
for(let i = 0; i < 60; i++) {
    let x = (i%(game.clientWidth/bW+5))*(bW+1);
    let y = parseInt(i/(game.clientWidth/bW+5))*(bH+1);
    if(x+bW <= game.clientWidth) {
        blocks[i] = new block(x, y);
    }
}
storage.setItem("hits", "0");
if(storage.getItem("highScore") == null) {
    storage.setItem("highScore", "0");
    storage.setItem("score", "0");
    scores = [storage.getItem("highScore"), storage.getItem("score"), storage.getItem("hits")];
} else {
    scores = [storage.getItem("highScore"), storage.getItem("score"), storage.getItem("hits")];
}
setScores(scores[0], scores[1], scores[2]);
addBall(new ball(50, game.clientHeight-60, 1, -1));
resize();

//CODE

setInterval(() => {
    let x = game.clientLeft;
    let y = game.clientTop;
    let width = game.clientWidth;
    let height = game.clientHeight;

    c.clearRect(0, 0, width, height);

    c.beginPath();
    c.fillRect(padX, y+height-40, 100, 20);
    c.stroke();

    balls.forEach((e, i) => {
        if(e != null) {
            c.beginPath();
            c.arc(e.x, e.y, bigBallEndTime != -1 ? 20 : 10, 0, Math.PI*2, false);
            c.fillStyle = 'black';
            c.fill();
            c.stroke();
            
            e.y+=e.velocity[1]*e.speed;
            e.x+=e.velocity[0]*e.speed;

            if(e.x+10 > width) e.velocity[0] = -1;
            if(e.x < 0) e.velocity[0] = 1;
            if(e.y < 0) e.velocity[1] = 1;
            if(e.y+10 > height) {
                balls = createTableWithout(balls, e);
            }
            if(balls.length == 0) {
                lost = true;
                loseScreen.setAttribute("style", "display: unset;");
                bullets = [];
                balls = [];
            }
            if(e.y+10 >= y+height-40 && e.y+10 <= y+height-20 && e.x+10 >= padX && e.x+10 <= padX+100) {
                if(!onPad) {
                    e.velocity[1] = -1;
                    if(e.y > y+height-40) e.y = y+height-50;
                    setScores(-1, -1, scores[2]++);
                    onPad = true;
                    e.speed+=0.5;
                }
            } else {
                onPad = false;
            }

            blocks.forEach((e2, i2) => {
                if(e2 != null && e.y >= e2.y && e.y <= e2.y+bH && e.x >= e2.x && e.x <= e2.x+bW) {
                    e.velocity[1] = reverseVelocity(e.velocity[1]);
                    blocks = createTableWithout(blocks, e2);
                    if(bigBallEndTime != -1) {
                        if(i2 != 0) blocks = createTableWithout(blocks, blocks[i2-1]);
                        if(i2 != blocks.length-1) blocks = createTableWithout(blocks, blocks[i2+1]);
                    }

                    if(chanceOf(25)) {
                        extrass[extrass.length] = new extras(e2);
                    }
                }
            });
        }
    });
    if(blocks.length == 0) {
        won = true;
        wonScreen.setAttribute("style", "display: unset;");
        setScores(-1, scores[1], -1);
        if(scores[1] > scores[0]) {
            setScores(scores[1], -1, -1);
        }
        balls = [];
    }
    blocks.forEach((e, i) => {
        if(e != null) {
            c.beginPath();
            c.fillRect(e.x, e.y, bW, bH);
            c.stroke();
        }
    });

    if(bigBallEndTime < new Date()) {
        bigBallEndTime = -1;
    }

    if(gunEndTime < new Date()) {
        gunEndTime = -1;
    } else if(gunEndTime%100 == 0) {
        bullets[bullets.length] = new bullet(padX, y+height-55);
        bullets[bullets.length] = new bullet(padX+100, y+height-55);
    }

    bullets.forEach((e, i) => {
        c.beginPath();
        c.fillRect(e.x, e.y, 2, 6);
        c.stroke();
        e.y-=5;
        blocks.forEach((e2, i2) => {
            if(e2 != null && e.y >= e2.y && e.y <= e2.y+bH && e.x >= e2.x && e.x <= e2.x+bW) {
                bullets = createTableWithout(bullets, e);
                blocks = createTableWithout(blocks, e2);
            }
        });
    });

    extrass.forEach((e, i) => {
        c.beginPath();
        c.fillRect(e.x, e.y, 10, 10);
        c.stroke();
        e.y+=2;
        if(e.y+10 >= y+height-40 && e.y+10 <= y+height-20 && e.x+10 >= padX && e.x+10 <= padX+100) {
            console.log(e.type);
            if(e.type == "tripple") {
                addBall(new ball(padX, y+height-55, 1, -1));
                addBall(new ball(padX+100, y+height-55, -1, -1));
            }
            if(e.type == "gun") {
                gunEndTime = new Date()*1+6969;
            }
            if(e.type == "big") {
                bigBallEndTime = new Date()*1+6969;
            }
            extrass = createTableWithout(extrass, e);
        }
    });
    
    if(!lost) {
        let add = 0;
        if(leftDown) {
            add = -1;
        }
        if(rightDown) {
            add = 1;
        }
        if(add > 0 && padX+100 < game.clientWidth) padX+=10;
        if(add < 0 && padX > 0) padX-=10;
    }
}, 20);

document.addEventListener("keyup", (e) => {
    if(e.key == "a" || e.key == "ArrowLeft") {
        leftDown = false;
    }
    if(e.key == "d" || e.key == "ArrowRight") {
        rightDown = false;
    }
});

document.addEventListener("keydown", (e) => {
    if(e.key == "a" || e.key == "ArrowLeft" && !rightDown) {
        leftDown = true;
    }
    if(e.key == "d" || e.key == "ArrowRight" && !leftDown) {
        rightDown = true;
    }
});

function ball(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velocity = [velX, velY];
    this.speed = 5;
}
function addBall(ball) {
    balls[balls.length] = ball;
}

function block(x, y) {
    this.x = x;
    this.y = y;
}

function extras(block) {
    this.x = block.x+(bW/2);
    this.y = block.y+(bH/2);
    this.type = "tripple";
    if(chanceOf(50)) {
        this.type = "gun";
    } else if(chanceOf(50)) {
        this.type = "big";
    } else {
        this.type = "tripple";
    }
}

function bullet(x, y) {
    this.x = x;
    this.y = y;
}

function reverseVelocity(velocity) {
    return -velocity;
}

function chanceOf(perc) {
    return Math.round(Math.random()*100) <= perc;
}

function setScores(high, curr, hits) {
    if(high != -1) {
        document.querySelector(".highscore").innerHTML = "High Score: " + high;
        storage.setItem("highScore", "" + high);
    }
    if(curr != -1) {
        document.querySelector(".currscore").innerHTML = "Score: " + curr;
        storage.setItem("score", "" + curr);
    }
    if(hits != -1) {
        document.querySelector(".hits").innerHTML = "Hits: " + hits;
        storage.setItem("hits", "" + hits);
    }
}

function createTableWithout(table, item) {
    let table2 = [];
    table.forEach(function(e, i) {
        if(e != item) table2[table2.length] = e;
    });
    return table2;
}