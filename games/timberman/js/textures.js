const textures = new (function() {
    this.loaded = [];

    this.loadTexture = function(name, src) {
        let has = false;
        this.loaded.forEach(e => {
            if(e.name == name) has = true;
        });
        if(!has) {
            this.loaded[this.loaded.length] = new this.texture(name, src);
        }
    }

    this.getTexture = function(name) {
        let r = null;
        this.loaded.forEach((e, i) => {
            if(e.name == name) r = e;
        });
        return r;
    }

    this.texture = function(name, src) {
        this.name = name;
        this.src = src;
        let img = new Image();
        img.src = this.src;
        this.img = img;
    }
});