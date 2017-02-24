import Drawable from './Drawable';

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

export default Enemy;
