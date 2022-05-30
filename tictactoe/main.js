const winner = document.querySelector(".winner");
const turndiv = document.querySelector(".turn");
const gamediv = document.querySelector(".game");
const menudiv = document.querySelector(".menu");
const lobbydiv = document.querySelector(".lobby");
const args = new URLSearchParams(window.location.search);
const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

let game = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
let turn = 0, moves = 0;
let playing = true;
let online = false;
var gameid = args.get("gameId");
var host = args.get("host") == "true";
var gameref = firebase.database().ref("games/"+gameid+"/players");

var opponentUUID;

function init() {
    if(gameid != null) {
        firebase.auth().onAuthStateChanged((u) => {
            if(u) {
                console.log(u);
                uuid = u.uid;
                ref = firebase.database().ref("games/"+gameid+"/players/"+uuid);
                ref.set({
                    uuid: uuid,
                    host: host,
                    move: -1
                });

                ref.onDisconnect().remove();
            }
        });

        menudiv.className+=" hidden";
        lobbydiv.className = lobbydiv.className.replace(" hidden", "");
        document.querySelector(".gid").innerHTML = args.get("gameId");
    }
}
init();

function startGame() {
    online = true;
    lobbydiv.className+=" hidden";
    gamediv.className = gamediv.className.replace(" hidden", "");
    if(!host) {
        turn = 1;
    }
    turndiv.innerHTML = "It's "+(turn==0?"Your":"Opponent")+"'s turn!";
}

window.onclick = (e) => {
    if(!playing) return;
    if(!online) {
        if(e.target.className.includes("cell")) {
            let cellId = e.target.className.replace("cell", "")*1-1;
            if(game[cellId]==-1) {
                game[cellId] = turn;
    
                e.target.innerHTML = turn == 0 ? "O" : "X";
    
                turn = turn == 0 ? 1 : 0;
                moves++;
                turndiv.innerHTML = "It's "+(turn==0?"O":"X")+"'s turn!";
            }
            checkMoves();
        }
    } else {
        if(e.target.className.includes("cell") && turn == 0) {
            let cellId = e.target.className.replace("cell", "")*1-1;
            if(game[cellId]==-1) {
                game[cellId] = turn;
    
                e.target.innerHTML = host ? "O" : "X";
                console.log(turn);
                turn = 1;
                console.log(turn);
                moves++;
                turndiv.innerHTML = "It's "+(turn==0?"Your":"Opponent")+"'s turn!";
                ref.set({
                    uuid: uuid,
                    host: host,
                    move: cellId
                });
            }
            checkMoves();
        }
    }
    if(e.target.className.includes("join")) {
        online = true;
        let g = document.querySelector(".gameid");
        if(g.value.length != 4) {
            alert("Game id should be 4-digit string");
        } else {
            window.location.href = window.location.href.split("?")[0]+"?gameId="+g.value;
        }
    } if(e.target.className.includes("hostonline")) {
        online = true;
        window.location.href = window.location.href.split("?")[0]+"?gameId="+createGameId()+"&host=true";

    } if(e.target.className.includes("hostoffline")) {
        online = false;
        gamediv.className = gamediv.className.replace(" hidden", "");
        menudiv.className+=" hidden";
        turndiv.innerHTML = "It's "+(turn==0?"O":"X")+"'s turn!";
    }
}
function checkMoves() {
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 3; j++) {
            if(game[j*3]==i && game[(j*3)+1]==i && game[(j*3)+2]==i) win(i);
            if(game[j]==i && game[j+3] == i && game[j+6] == i) win(i);
        }
        if(game[0] == game[4] && game[0] == game[8] && game[0] == i) win(i);
        if(game[2] == game[4] && game[2] == game[6] && game[2] == i) win(i);
    }
    if(moves >= 9) {
        win(-1);
        return;
    }
}
function win(player) {
    playing = false;
    if(player==-1) {
        winner.innerHTML = "Draw!"+(host?"<br><button class=\"replay\">Play again!</button>":"");
        return;
    }
    if(!online) winner.innerHTML = (player==0?"O":"X")+"'s won the game!";
    else {
        winner.innerHTML = (player==(host?0:1)?"O":"X")+"'s won the game!";
    }
    turndiv.innerHTML = "";
}

function createGameId() {
    let r = "";

    for(let i = 0; i < 4; i++) {
        r+=alphabet[Math.round(Math.random()*(alphabet.length-1))];
    }

    return r;
}

let playerID = -1;
gameref.on("value", e => {
    console.log("VALUES: ", e.val());
    Object.keys(e.val()).forEach((ev, i) => {
        let p = e.val()[ev];
        if(p.uuid==uuid) playerID = i;
        if(p.host && !host) {
            opponentUUID = p.uuid;
            startGame();
        }
        if(opponentUUID != null && p.uuid == opponentUUID && p.move >= 0 && game[p.move] == -1 && playing) {
            console.log(p.uuid, uuid);
            game[p.move] = 1;
            turn = turn == 1 ? 0 : 1;
            moves++;
            turndiv.innerHTML = "It's "+(turn==0?"Your":"Opponent")+"'s turn!";
            document.querySelector(".cell"+(p.move+1)).innerHTML = !host ? "O" : "X";
        }
        checkMoves();
    });
});
gameref.on("child_added", e => {
    console.log("ADDED: ", e.val());
    let p = e.val();
    if(!p.host && host && opponentUUID == null) {
        opponentUUID = p.uuid;
        startGame();
    }
})