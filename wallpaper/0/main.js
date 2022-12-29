const clock = document.querySelector(".clock");
const c = clock.getContext("2d");

const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var w, h;
var angles = [];
var box = [3, 5];
var s = [box[0]*45, box[1]*45];
var lastmins = -1;
var dest = [];

init();
function init() {
    setup();
    scale();
    tick();
    draw();
}
function draw() {
    window.requestAnimationFrame(draw);
    c.fillStyle = "black";
    c.fillRect(0, 0, w, h);
    angles.forEach((e, k) => {
        let x = w/2-s[0]*2+(s[0]*(k+(k>1?0.25:0)));
        let y = h/2-s[1]/2;
        c.translate(x, y);
        for(let i = 0; i < e.length; i++) {
            let v = e[i];
            let mcx = (i%box[0])*45;
            let mcy = parseInt(i/box[0])*45;
            c.beginPath();
            c.lineWidth = 1;
            c.strokeStyle = "white";
            c.arc(mcx, mcy, 20, 0, Math.PI*2);
            c.stroke();
    
            c.translate(mcx, mcy);
            for(let j = 0; j < 2; j++) {
                c.beginPath();
                c.rotate(-90*(Math.PI/180));
                c.moveTo(0, 0);
                let px = 20*Math.cos(v[j]*(Math.PI/180));
                let py = 20*Math.sin(v[j]*(Math.PI/180));
                c.lineTo(px, py);
                c.lineWidth = 5;
                c.stroke();
                c.rotate(90*(Math.PI/180));
                c.closePath();
            }
            c.translate(-mcx, -mcy);
    
            c.closePath();
        }
        c.translate(-x, -y);
        if(dest[k]!=null) {
            for(let i = 0; i < dest[k].length; i++) {
                let v = dest[k][i];
                let vs = e[i];
                for(let j = 0; j < 2; j++) {
                    let vx = v[j];
                    let vy = vs[j]
                    if(vx<0) vx = 360+vx;
                    if(vy<0) vy = 360+vy;
                    if(vy%360!=vx) {
                        e[i][j]+=j==1?0.5:1;
                        e[i][j]%=360;
                    }
                }
            }
        }
    });
    let d = new Date();

    c.fillStyle = "white";
    c.textAlign = "center";
    c.font = "50px Dosis";
    c.fillText(d.getDate()+" "+month[d.getMonth()]+" "+d.getFullYear(), w/2, h/2-s[1]-50);
    c.font = "100px Dosis";
    c.fillText(week[d.getDay()], w/2, h/2-s[1]/2-50);
}
function tick() {
    setTimeout(() => {
        tick();
    }, 50);
    let d = new Date();
    if(lastmins!=d.getMinutes()) {
        lastmins = d.getMinutes();
        setToCurrentTime();
    }
}
function scale() {
    w = clock.width = window.innerWidth;
    h = clock.height = window.innerHeight;
    window.onresize = scale;
}
function setup() {
    for(let i = 0; i < 4; i++) {
        angles[i] = [];
        for(let j = 0; j < box[0]*box[1]; j++) {
            angles[i][j] = [0, 0];
        }
    }
}
// setToCurrentTime(true, new Date(2022, 11, 29, 1, 29))
function setToCurrentTime(a = true, d = new Date()) {
    if(a) {
        let h = d.getHours();
        let m = d.getMinutes();
        if(m==60) {
            h++;
            m = 0;
        }
        if((h+"").length==1) {
            h = "0"+h;
        }
        if((m+"").length==1) {
            m = "0"+m;
        }
        h = h+"";
        m = m+"";
        for(let i = 0; i < 2; i++) {
            dest[i] = [...n[h[i]*1]];
            dest[2+i] = [...n[m[i]*1]];
        }
    } else {
        let h = d.getHours();
        let m = d.getMinutes();
        if(m==60) {
            h++;
            m = 0;
        }
        if((h+"").length==1) {
            h = "0"+h;
        }
        if((m+"").length==1) {
            m = "0"+m;
        }
        h = h+"";
        m = m+"";
        for(let i = 0; i < 2; i++) {
            angles[i] = [...n[h[i]*1]];
            angles[2+i] = [...n[m[i]*1]];
        }
    }
}