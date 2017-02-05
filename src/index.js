require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/stars.png');
// TODO: Figure out better way of loading images


// Images, using ES6 class
//
class ImageController {
    constructor() {
        this.images = {};
    }

    setImage(name, src) {
        this.images[name] = new Image();
        this.images[name].src = src;
    }

    getImage(name) {
        return this.images[name];
    }

    logImage(name) {
        console.log(this.images[name]);
    }
}


// Represents a drawable object, currently only the background
//
class Entity {
    constructor(x, y, speed, canvas, context) {
        // TODO: Also have init()?
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.canvas = canvas;
        this.context = context;
    }

    // TODO: Make draw function more versatile
    //
    draw() {
        this.x += this.speed;

        const bg = imageController.getImage('bg');

        this.context.drawImage(bg, this.x, this.y);
        this.context.drawImage(bg, this.x - this.canvas.width, this.y);

        if(this.x >= this.canvas.width)
            this.x = 0;
    }
}


class Game {
    constructor() {
        // TODO: Find better way to manage canvases, maybe parameters of the constructor? config object?
        this.bgCanvas = document.querySelector('canvas.bg');
        // Maybe put image loading here? Have imageController be an attribute of this object?
    }

    init() {
        if(this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');

            this.background = new Entity(0, 0, 1, this.bgCanvas, this.bgContext);

            return true;
        } else return false;
    }

    start() {
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        this.background.draw();
    }
}


// Initialize the game
//
const imageController = new ImageController();
imageController.setImage('bg', 'stars.png');

const game = new Game();
if(game.init()) game.start();
