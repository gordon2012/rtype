require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');
require('file-loader?name=[name].[ext]!./images/stars_small.png');
require('file-loader?name=[name].[ext]!./images/player.png');
require('file-loader?name=[name].[ext]!./images/debug.png');
// TODO: Figure out better way of loading images


// Images, using ES6 class
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

    logImage(name) {
        console.log(this.images[name]);
    }

    isLoaded() {
        // console.log('IS LOADED');


        // var keys = Object.keys(this.images);
        // var check = false;
        // check = keys.every((key) => this.loaded.hasOwnProperty(key));
        // if(!check) console.log(check);
        // return check;

        return Object.keys(this.images).every((key) => this.loaded.hasOwnProperty(key));


        // return false;
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
        // const player = imageController.getImage('player');
        const player = this.image;

        this.context.drawImage(player, this.x, this.y);
    }
}

class Background extends Drawable {
    constructor(x, y, speed, canvas, context, image) {
        super(x, y, canvas, context, image);

        this.speed = speed;
    }

    draw() {
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.x += this.speed.x;
        this.y += this.speed.y;

        //
        // const bg = imageController.getImage('bg');
        const bg = this.image;
        


        // if (bg === undefined) console.log('FALSE');
        // console.log(bg.width, bg.height);

        // console.log('DRAW BACKGROUND');
        // this.context.drawImage(bg, this.x, this.y);

        //*
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
        //*/
    }
}


class Game {
    constructor() {
        // TODO: Find better way to manage canvases, maybe parameters of the constructor? config object?
        this.bgCanvas = document.querySelector('canvas.bg');
        // Maybe put image loading here? Have imageController be an attribute of this object?
    }

    run() {


        // var p = new Promise(() => game.loadImages());
        // p.then(() => console.log('IMAGES LOADED'));

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
        // Init images here?
        //
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


// Initialize the game
//
// const imageController = new ImageController();
// imageController.setImage('bg', 'stars_small.png');
// imageController.setImage('bg', 'https://source.unsplash.com/CzigtQ8gPi4/1500x1500');
// imageController.setImage('player', 'player.png');



const game = new Game();
game.run();

// if(game.init()) {
    
//     var images = [
//         {name: 'bg', url: 'https://source.unsplash.com/CzigtQ8gPi4/1500x1500'},
//         {name: 'player', url: 'player.png'}
//     ];

//     Promise.all


//     // var p = new Promise((res, rej) => game.loadImages());
//     // p.then(() => console.log('IMAGES LOADED'));

//     // Promise.resolve(() => game.loadImages())
//     //     .then(() => console.log('IMAGES LOADED'));


//     game.start();
// }
