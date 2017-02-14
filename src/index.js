require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/black.png');
require('file-loader?name=[name].[ext]!./images/player.png');
require('file-loader?name=[name].[ext]!./images/stars_big.png');
require('file-loader?name=[name].[ext]!./images/stars_small.png');
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
        this.x = x;
        this.y = y;
    }
}

class Drawable extends Entity {
    constructor(x, y, canvas, image) {
        super(x, y);
        this.canvas = document.querySelector(canvas);
        this.image = image;
    }

    init() {
        if(!this.canvas.getContext) return false;
        this.context = this.canvas.getContext('2d');
        return true;
    }

    draw() {
        if(this.image) this.context.drawImage(this.image, this.x, this.y);
    }
}

class Background extends Drawable {
    constructor(x, y, speed, canvas, image) {
        super(x, y, canvas, image);

        this.speed = speed;
    }

    init() {
        // TODO: Make DRY
        if(!this.canvas.getContext) return false;
        this.context = this.canvas.getContext('2d');
        return true;
    }

    draw() {
        // TODO: Refactor into separate entity
        //
        // this.context.fillStyle = 'black'
        // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
    }

    run() {
        this.images = new ImageController();

        this.images.fetchImages(['player.png', 'black.png', 'stars_big.png', 'stars_small.png'], () => {
            if(this.init()) {
                this.start();
            }
        });
    }

    init() {
        console.log('INIT GAME')

        this.background = new Background(0, 0, {x: 0, y: 0}, 'canvas.bg', this.images.loadImage('black.png'));
        this.bg2 = new Background(0, 0, {x: -1, y: 0}, 'canvas.bg', this.images.loadImage('stars_big.png'));
        this.bg3 = new Background(0, 0, {x: -2, y: 0}, 'canvas.bg', this.images.loadImage('stars_small.png'));

        this.player = new Drawable(128, 128, 'canvas.bg', this.images.loadImage('player.png'));

        return this.background.init() && this.player.init(), this.bg2.init(), this.bg3.init();
    }

    start() {
        console.log('START GAME')
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        
        this.background.draw();
        this.bg3.draw();
        this.bg2.draw();
        this.player.draw();
    }
}


// The Game
//
const game = new Game();
game.run();
