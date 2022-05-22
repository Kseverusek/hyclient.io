function color(x, y, z) {
    var c = 'rgba(' + x + ',' + y + ',' + z + ',1' + ')';
    
    return c;
}

function point(x, y, color) {
    c.beginPath();
    c.rect(x, y, 1, 1);
    c.fillStyle = color;
    c.fill();
}

function circle(x, y, r, color) {
    c.beginPath();
    c.fillStyle = color;
    c.arc(x, y, r,0,2*Math.PI);
    c.fill();
};

function line(x1, y1, x2, y2, color) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.strokeStyle = color;
    c.stroke();
}

function drawNodes(nodes) {
    for(var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        
        var x = node[0];
        var y = node[1];

        circle(x, y, nodes.length, "red");
    }
}

function drawEdges(cube) {
    let edges = cube.edges;
    let nodes = cube.nodes;
    for(var e = 0; e < edges.length; e++) {
        var edge = edges[e];
        
        var e1 = edge[0];
        var e2 = edge[1];
        
        var n1 = nodes[e1];
        var n2 = nodes[e2];
        
        var x1 = n1[0];
        var y1 = n1[1];
        
        var x2 = n2[0];
        var y2 = n2[1];
        
        line(x1, y1, x2, y2, cube.color);
    }
}

var transformQuotient = Math.PI/180;
class Cube3d {
    constructor(x, y, w, h, d, rx, ry, rz) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.d = d;
        this.nodes = [
            [-this.w, -this.h, -this.d],
            [-this.w, -this.h, this.d],
            [-this.w, this.h, -this.d],
            [-this.w, this.h, this.d],
            [this.w, -this.h, -this.d],
            [this.w, -this.h, this.d],
            [this.w, this.h, -this.d],
            [this.w, this.h, this.d]
        ];
        this.edges = [
            [0, 1],[1, 3],[3, 2],[2, 0],
            [4, 5],[5, 7],[7, 6],[6, 4],
            [0, 4],[1, 5],[2, 6],[3, 7]
        ];
        this.rotateNodes3DonX(rx);
        this.rotateNodes3DonY(ry);
        this.rotateNodes3DonZ(rz);
        this.color = color(r(0, 255), r(0, 255), r(0, 255));
        this.scale = r(-2, 2);
        let c = r(0.01, 0.1);
        this.scaleChange = this.scale > 0 ? -c : c;
    }
    draw() {
        c.save();
        c.translate(this.x, this.y);

        drawEdges(this);

        c.restore();
    };
    rotateNode3DonZ(node, theta) {
        var x = this.nodes[node][0];
        var y = this.nodes[node][1];
        
        theta *= transformQuotient;
        
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        
        var x = this.nodes[node][0];
        var y = this.nodes[node][1];
        
        this.nodes[node][0] = x * cosTheta - y * sinTheta;
        this.nodes[node][1] = x * sinTheta + y * cosTheta;
    }
    rotateNodes3DonZ(theta) {
        for(var n = 0; n < this.nodes.length; n++) {
            this.rotateNode3DonZ(n, theta);
        }
    }
    rotateNode3DonX(node, theta) {
        var y = this.nodes[node][1];
        var z = this.nodes[node][2];
        
        theta *= transformQuotient;
        
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        
        var y = this.nodes[node][1];
        var z = this.nodes[node][2];
        
        this.nodes[node][1] = y * cosTheta - z * sinTheta;
        this.nodes[node][2] = y * sinTheta + z * cosTheta;
    }
    rotateNodes3DonX(theta) {
        for(var n = 0; n < this.nodes.length; n++) {
            this.rotateNode3DonX(n, theta);
        }
    }
    rotateNode3DonY(node, theta) {
        var x = this.nodes[node][0];
        var z = this.nodes[node][2];
        
        theta *= transformQuotient;
        
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        
        var x = this.nodes[node][0];
        var z = this.nodes[node][2];
        
        this.nodes[node][0] = x * cosTheta - z * sinTheta;
        this.nodes[node][2] = x * sinTheta + z * cosTheta;
    }
    rotateNodes3DonY(theta) {
        for(var n = 0; n < this.nodes.length; n++) {
            this.rotateNode3DonY(n, theta);
        }
    }
}