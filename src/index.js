require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/stars.png');
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
        return this.images[name];
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

            // this.background = new Entity(0, 0, 1, this.bgCanvas, this.bgContext);
            this.background = new Background(0, 0, 1, this.bgCanvas, this.bgContext);

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
imageController.setImage('bg', 'stars.png');
imageController.setImage('player', 'player.png');

const game = new Game();
if(game.init()) game.start();
