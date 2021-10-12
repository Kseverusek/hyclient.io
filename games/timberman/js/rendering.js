const render = new function() {
    this.canv = null;
    this.c = null;

    this.setObject = function(obj) {
        this.canv = obj;
        this.c = obj.getContext('2d');
    }

    this.start = function() {
        this.c.save();
        this.c.beginPath();
    }
    this.end = function() {
        this.c.stroke();
        this.c.restore();
    }
    this.color = function(color) {
        this.c.strokeStyle = color;
        this.c.fillStyle = color;
    }
    this.line = function(x1, y1, x2, y2) {
        this.c.moveTo(x1, y1);
        this.c.lineTo(x2, y2);
    }
    this.rect = function(x, y, w, h, filled) {
        if(filled) this.c.fillRect(x, y, w, h);
        else this.c.rect(x, y, w, h);
    }
    this.image = function(image, x, y, w, h) {
        this.c.drawImage(image, x, y, w, h);
    }
    this.text = function(str, x, y, font, align) {
        this.c.font = font;
        this.c.textAlign = align;
        this.c.fillText(str, x, y)
    }
    this.move = function(x, y) {
        this.c.translate(x, y);
    }
    this.scale = function(scaleX, scaleY) {
        this.c.scale(scaleX, scaleY);
    }
    this.scale = function(scale) {
        this.c.scale(scale, scale);
    }
    this.opacity = function(opacity) {
        this.c.globalAlpha = opacity;
    }
    this.rotate = function(deg) {
        this.c.rotate(deg);
    }
    this.clear = function() {
        this.clear(0, 0, canv.width, canv.height);
    }
    this.clear = function(x, y, w, h) {
        this.c.clearRect(x, y, w, h);
    }
}