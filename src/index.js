require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/stars_small.png');
require('file-loader?name=[name].[ext]!./images/player.png');
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
        return this.images[name] || false;
    }

    logImage(name) {
        console.log(this.images[name]);
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
    constructor(x, y, canvas, context) {
        super(x, y);

        this.canvas = canvas;
        this.context = context;
    }
    draw() {
        const player = imageController.getImage('player');

        this.context.drawImage(player, this.x, this.y);
    }
}

class Background extends Drawable {
    constructor(x, y, speed, canvas, context) {
        super(x, y, canvas, context);

        this.speed = speed;
    }

    draw() {
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.x += this.speed.x;
        this.y += this.speed.y;

        const bg = imageController.getImage('bg');
        console.log(bg.width, bg.height);
        for(let i = -bg.width; i < this.canvas.width; i += bg.width) {
            for(let j = -bg.height; j < this.canvas.height; j += bg.height) {
                this.context.drawImage(bg, this.x + i, this.y + j);
            }
        }
        if(this.x > bg.width)
            this.x = 0;
        if(this.x < 0)
            this.x = bg.width;
        if(this.y > bg.height)
            this.y = 0;
        if(this.y < 0)
            this.y = bg.height;
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

            this.background = new Background(0, 0, {x: -3, y: 1}, this.bgCanvas, this.bgContext);
            this.player = new Drawable(128, 128, this.bgCanvas, this.bgContext);

            return true;
        } else return false;
    }

    start() {
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        this.background.draw();

        this.player.draw();
    }
}


// Initialize the game
//
const imageController = new ImageController();
imageController.setImage('bg', 'stars_small.png');
// imageController.setImage('bg', 'https://source.unsplash.com/CzigtQ8gPi4/1500x1500');


imageController.setImage('player', 'player.png');

const game = new Game();
if(game.init()) game.start();
