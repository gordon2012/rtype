require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/black.png');
require('file-loader?name=[name].[ext]!./images/player.png');
require('file-loader?name=[name].[ext]!./images/stars_big.png');
require('file-loader?name=[name].[ext]!./images/stars_small.png');
require('file-loader?name=[name].[ext]!./images/laserGreen10.png');
require('file-loader?name=[name].[ext]!./images/meteorBrown_big1.png');
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
                if(this.success + this.fail == list.length)
                    callback();
            });

            img.addEventListener('error', () => {
                this.success++;
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
// - Entity: base object that could be used as an invisible or controller object
// - Drawable: basic object for screen entities
// - Bullet: projectiles launched from player (so far) inside a Pool object
// - Player: The player's avatar
// - Enemy: Meteor object that can collide with the player and her bullets
// - Pool: Object that contains reusable bullet objects (so far)
// - Background: specialized scrolling background entity
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
        this.isCollider = true;
    }

    doCollision(other) {
        if(other.tag == 'player') return;
        this.alive = false;
        this.clear();
    }

    move() {
        this.clear();
        this.x+= this.speed;

        // Only works for player bullets so far
        //
        if(this.x > this.canvas.width) this.alive = false;
    }
}


class Player extends Drawable {
    constructor(x, y, speed, canvas, image) {
        // TODO: speed as object with acceleration and maxVelocity?
        super(x, y, canvas, image);
        this.speed = speed;
        this.cooldown = 0;

        this.isCollider = true;
        this.tag = 'player';

        this.pool = new Pool();
        game.addEntity(this.pool);
    }

    doCollision(other) {
        if(this.pool.entities.includes(other)) return;
        this.clear();
        this.x = 128;
        this.y = 128;
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
            this.pool.add(new Bullet(this.x + w/2, this.y + h/2 - 6  , 'canvas.player-pool', 15, game.images.loadImage('laserGreen10.png')));
        }
        this.cooldown = Math.max(0, this.cooldown - 1);
    }
}


class Enemy extends Drawable {
    constructor(x, y, canvas, image) {
        super(x, y, canvas, image);

        this.speed = -3;
        this.isCollider = true;
    }

    init() {
        return super.init();
    }

    doCollision(other) {
        if(other.tag == 'player') {
            this.reset(0);
        } else if(other.alive) {
            this.reset(0.5);
        }
    }

    reset(inc) {
        const [w, h, cw, ch] = [this.image.width, this.image.height, this.canvas.width, this.canvas.height];
        this.clear();

        this.x = cw;
        this.y = Math.random() * (ch - h);

        this.speed = Math.min(Math.max(-10, this.speed + inc), -3);
    }

    move() {
        this.clear();
        this.x+= this.speed;

        if(this.x < -this.image.width) {
            this.reset(-0.5);
        }
    }
}


// Pool object that acts as an array of reusable entities such as bullets
//
// TODO: add target, step, and timeout for array expansion/contraction
//
class Pool extends Entity {
    constructor() {
        super(0,0);
        this.entities = [];
        // arbitrary max(target) for now is 10
        this.target = 10;
        this.isPool = true;
    }

    init() {
        return true;
    }

    add(entity) {
        if(this.entities.length < this.target) {
            this.entities.push(entity);
            entity.alive = entity.init();
            return entity.alive;
        } else {
            var deads = this.entities.filter(e => !e.alive);
            if(deads.length > 0) {
                [deads[0].x, deads[0].y] = [entity.x, entity.y];
                deads[0].alive = true;
                return true;
            } else {
                // Should be unreachable because the current bullet speed and cooldown
                // do not allow 10 bullets on the screen
                //
                // TODO: expand the array as needed
                console.log('NO FREE SPACE');
            }
        }
    }

    move() {
        this.entities.forEach(entity => {
            if(entity.alive && entity.move) entity.move();
        });
    }

    draw() {
        this.entities.forEach(entity => {
            if(entity.alive && entity.draw) entity.draw();
        });
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

// Singleton object that represents the game itself to avoid polluting the global namespace
//
// TODO: Find better way to manage canvases, maybe parameters of the constructor? config object?
// TODO: Actually use the singleton pattern (or not at all?)
//
class Game {
    constructor() {
        this.entities = [];
    }

    addEntity(ent) {
        this.entities.push(ent);
        return ent.init();
    }

    run() {
        this.images = new ImageController();

        this.images.fetchImages(['player.png', 'black.png', 'stars_big.png', 'stars_small.png', 'laserGreen10.png', 'meteorBrown_big1.png'], () => {
            if(this.init()) {
                this.start();
            }
        });
    }

    init() {
        var success = true;

        success = success && this.addEntity(new Background(0, 0, {x: 0, y: 0}, 'canvas.bg', this.images.loadImage('black.png')));
        success = success && this.addEntity(new Background(0, 0, {x: -4, y: 0}, 'canvas.bg', this.images.loadImage('stars_big.png')));
        success = success && this.addEntity(new Background(0, 0, {x: -3, y: 0}, 'canvas.bg', this.images.loadImage('stars_small.png')));
        success = success && this.addEntity(new Player(128, 128, 3, 'canvas.player', this.images.loadImage('player.png')));
        success = success && this.addEntity(new Enemy(800, 128, 'canvas.enemy', this.images.loadImage('meteorBrown_big1.png')));

        return success;
    }

    start() {
        this.animate();
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        
        const checkCollision = (entity, other) => {
            const [ex, ey, ew, eh, ox, oy, ow, oh] = [entity.x, entity.y, entity.image.width, entity.image.height, other.x, other.y, other.image.width, other.image.height];
            if(ex < ox + ow && ex + ew > ox && ey < oy + oh && ey + eh > oy)
                if(entity.doCollision) {
                    this.collisions.push([entity, other])
                }
        }

        this.entities.forEach((entity, ei) => {
            if(entity.move) entity.move();
            if(entity.draw) entity.draw();

            // Collision detection
            //
            // TODO: Better collision entity conflict resolution
            //
            this.collisions = [];
            if(entity.isCollider) {
                this.entities.forEach((other, oi) => {
                    if(ei != oi && other.isCollider) {
                        checkCollision(entity, other);

                    } else if(other.isPool) {
                        other.entities.forEach((poolother) => {
                            checkCollision(entity, poolother)
                        });
                    }
                });
            }
            if(this.collisions.length) {
                this.collisions.forEach(colliders => {
                    colliders[0].doCollision(colliders[1]);
                    colliders[1].doCollision(colliders[0]);
                });
            }
        });
    }
}


// Keyboard input
//
// TODO: fix conflict between arrow keys and WASD, or pick one
//
var input = { up: 0, down: 0, left: 0, right: 0, shoot: 0 };

function handleInput(e, val) {
    e.preventDefault();
    var key = (e.keyCode) ? e.keyCode : e.charCode;

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
