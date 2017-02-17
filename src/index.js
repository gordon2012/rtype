require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/black.png');
require('file-loader?name=[name].[ext]!./images/player.png');
require('file-loader?name=[name].[ext]!./images/stars_big.png');
require('file-loader?name=[name].[ext]!./images/stars_small.png');
require('file-loader?name=[name].[ext]!./images/laserGreen10.png');
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

// TODO: Add separate object that contains the canvas and context so each
//  image does not have to call getContext('2d') on init

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

    clear() {
        const [w, h] = [this.image.width, this.image.height];
        this.context.clearRect(this.x, this.y, w, h);
    }
}

class Bullet extends Drawable {
    constructor(x, y, canvas, speed, image) {
        super(x, y, canvas, image);

        this.speed = speed;
    }

    move() {
        this.clear();
        this.x+= this.speed;
    }
}

class Player extends Drawable {
    constructor(x, y, speed, canvas, image) {
        // TODO: speed as object with acceleration and maxVelocity?
        super(x, y, canvas, image);
        this.speed = speed;

        this.cooldown = 0;
    }

    move() {
        const [w, h] = [this.image.width, this.image.height];
        this.clear();

        this.x += this.speed * (input.right - input.left);
        this.y += this.speed * (input.down - input.up);

        this.x = Math.min(this.canvas.width - w, Math.max(0, this.x));
        this.y = Math.min(this.canvas.height - h/2, Math.max(-h/2, this.y));

        if(input.shoot && this.cooldown == 0) {
            this.cooldown = 15;

            if(this.bullet && this.bullet.alive) this.bullet.clear();
            this.bullet = new Bullet(this.x + w/2, this.y + h/2 - 6  , 'canvas.player', 15, game.images.loadImage('laserGreen10.png'));
            this.bullet.alive = this.bullet.init();
        }
        this.cooldown = Math.max(0, this.cooldown - 1);

        if(this.bullet && this.bullet.alive) {
            this.bullet.move();
            this.bullet.draw();
        }
    }
}

class Background extends Drawable {
    constructor(x, y, speed, canvas, image) {
        super(x, y, canvas, image);

        this.speed = speed;
    }

    draw() {
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

        this.entities = [];
    }

    addEntity(ent) {
        this.entities.push(ent);
        return ent.init();
    }

    run() {
        this.images = new ImageController();

        this.images.fetchImages(['player.png', 'black.png', 'stars_big.png', 'stars_small.png', 'laserGreen10.png'], () => {
            if(this.init()) {
                this.start();
            }
        });
    }

    init() {
        console.log('INIT GAME')

        var success = true;

        success = success && this.addEntity(new Background(0, 0, {x: 0, y: 0}, 'canvas.bg', this.images.loadImage('black.png')));
        success = success && this.addEntity(new Background(0, 0, {x: -4, y: 0}, 'canvas.bg', this.images.loadImage('stars_big.png')));
        success = success && this.addEntity(new Background(0, 0, {x: -3, y: 0}, 'canvas.bg', this.images.loadImage('stars_small.png')));
        success = success && this.addEntity(new Player(128, 128, 3, 'canvas.player', this.images.loadImage('player.png')));

        return success;
    }

    start() {
        console.log('START GAME')
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        
        this.entities.forEach(entity => {
            if(entity.move) entity.move();
            if(entity.draw) entity.draw();
        });
    }
}


// Keyboard input
//
var input = { up: 0, down: 0, left: 0, right: 0, shoot: 0 };

function handleInput(e, val) {
    e.preventDefault();
    var key = (e.keyCode) ? e.keyCode : e.charCode;

    // TODO: fix conflict between arrow keys and WASD, or pick one
    // console.log(key);

    switch(key) {
        case 38:
        case 87:
            input.up = val;
            break;
        case 40:
        case 83:
            input.down = val;
            break;
        case 37:
        case 65:
            input.left = val;
            break;
        case 39:
        case 68:
            input.right = val;
            break;
        case 32:
            input.shoot = val;
    }
}

document.onkeydown = e => { handleInput(e, 1) };
document.onkeyup = e => { handleInput(e, 0) };


// The Game
//
const game = new Game();
game.run();
