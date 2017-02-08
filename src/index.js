require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/stars_small.png');
require('file-loader?name=[name].[ext]!./images/player.png');
require('file-loader?name=[name].[ext]!./images/debug.png');
// TODO: Figure out better way of loading images


// Object responsible for images
//
class ImageController {
    constructor() {
        this.images = {};
        this.loaded = {};
    }

    setImage(name, src) {
        this.images[name] = new Image();
        this.images[name].src = src;
        this.images[name].addEventListener('load', () => this.loaded[name] = true);
    }

    getImage(name) {
        console.log(this.images[name]);
        console.dir(this.images[name]);
        return this.images[name] || false;
    }

    isLoaded() {
        return Object.keys(this.images).every((key) => this.loaded.hasOwnProperty(key));
    }
}


// Entity hierarchy. Currently consists of:
//   - Entity: base object that could be used as an invisible or controller object
//   - Drawable: basic object for screen entities
//   - Background: specialized scrolling background entity
//
class Entity {
    constructor(x, y) {
        // TODO: Also have init()?
        this.x = x;
        this.y = y;
    }
}

class Drawable extends Entity {
    constructor(x, y, canvas, context, image) {
        super(x, y);

        this.canvas = canvas;
        this.context = context;
        this.image = image;
    }
    draw() {
        this.context.drawImage(this.image, this.x, this.y);
    }
}

class Background extends Drawable {
    constructor(x, y, speed, canvas, context, image) {
        super(x, y, canvas, context, image);

        this.speed = speed;
    }

    draw() {
        // TODO: Refactor into separate entity
        //
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //
        ////

        this.x += this.speed.x;
        this.y += this.speed.y;

        for(let i = -this.image.width; i < this.canvas.width; i += this.image.width) {
            for(let j = -this.image.height; j < this.canvas.height; j += this.image.height) {
                this.context.drawImage(this.image, this.x + i, this.y + j);
            }
        }
        if(this.x > this.image.width)
            this.x = 0;
        if(this.x < 0)
            this.x = this.image.width;
        if(this.y > this.image.height)
            this.y = 0;
        if(this.y < 0)
            this.y = this.image.height;
    }
}


class Game {
    constructor() {
        // TODO: Find better way to manage canvases, maybe parameters of the constructor? config object?
        this.bgCanvas = document.querySelector('canvas.bg');
        // Maybe put image loading here? Have imageController be an attribute of this object?
    }

    run() {
        // TODO: Load images using Promises?
        this.loadImages();

        if(this.init()) {
            this.start();
        }
    }

    init() {
        console.log('INIT GAME')
        if(this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');

            this.background = new Background(0, 0, {x: -3, y: 1}, this.bgCanvas, this.bgContext, this.images.getImage('bg'));
            this.player = new Drawable(128, 128, this.bgCanvas, this.bgContext, this.images.getImage('player'));

            return true;
        } else return false;
    }

    loadImages() {
        console.log('LOADING IMAGES');
        this.images = new ImageController();

        this.images.setImage('bg', 'stars_small.png');
        this.images.setImage('nasa', 'https://source.unsplash.com/CzigtQ8gPi4/1500x1500');
        this.images.setImage('player', 'player.png');
        this.images.setImage('debug', 'debug.png');
    }

    start() {
        console.log('START GAME')
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        
        if(this.images.isLoaded()) {
            this.background.draw();
            this.player.draw();
        } else {
            console.log('WAITING FOR IMAGE');
        }
    }
}


// The Game
//
const game = new Game();
game.run();
