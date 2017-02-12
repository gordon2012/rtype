require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/purple.png');
require('file-loader?name=[name].[ext]!./images/player.png');
require('file-loader?name=[name].[ext]!./images/debug.png');
// TODO: Figure out better way of loading images


// Object responsible for images
//
// TODO: Load images using Promises
//
class ImageController {
    constructor() {
        this.success = 0;
        this.fail = 0;
        this.images = {};
    }

    fetchImages(list, callback) {
        list.forEach(e => {
            var img = new Image();

            img.addEventListener('load', () => {
                this.success++;
                console.log(`SUCCESS: ${e} (${this.success})`);
                if(this.success + this.fail == list.length)
                    callback();
            });

            img.addEventListener('error', () => {
                this.success++;
                console.log(`FAIL: ${e} (${this.fail})`);
                if(this.success + this.fail == list.length)
                    callback();
            });

            img.src = e;
            this.images[e] = img;
        });
    }

    loadImage(path) {
        return this.images[path];
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
        if(this.image) this.context.drawImage(this.image, this.x, this.y);
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
    }

    run() {
        this.images = new ImageController();

        this.images.fetchImages(['player.png', 'purple.png'], () => {
            if(this.init()) {
                this.start();
            }
        });
    }

    init() {
        console.log('INIT GAME')
        if(this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');

            this.background = new Background(0, 0, {x: -3, y: 1}, this.bgCanvas, this.bgContext, this.images.loadImage('purple.png'));
            this.player = new Drawable(128, 128, this.bgCanvas, this.bgContext, this.images.loadImage('player.png'));

            return true;
        } else return false;
    }

    start() {
        console.log('START GAME')
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        
        this.background.draw();
        this.player.draw();
    }
}


// The Game
//
const game = new Game();
game.run();
