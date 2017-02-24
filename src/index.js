require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/black.png');
require('file-loader?name=[name].[ext]!./images/player.png');
require('file-loader?name=[name].[ext]!./images/stars_big.png');
require('file-loader?name=[name].[ext]!./images/stars_small.png');
require('file-loader?name=[name].[ext]!./images/laserGreen10.png');
require('file-loader?name=[name].[ext]!./images/meteorBrown_big1.png');
// TODO: Figure out better way of loading images
// TODO: Add separate object that contains the canvas and context so each
//  image does not have to call getContext('2d') on init

import ImageController from './ImageController';

import Player from './Player';
import Enemy from './Enemy';
import Background from './Background';


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
        success = success && this.addEntity(new Player(this, input, 128, 128, 3, 'canvas.player', this.images.loadImage('player.png')));
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
            entity.move();
            entity.draw();

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
