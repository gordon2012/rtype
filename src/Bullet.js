import Drawable from './Drawable';

class Bullet extends Drawable {
    constructor(x, y, canvas, speed, image) {
        super(x, y, canvas, image);

        this.speed = speed;
        this.isCollider = true;
    }

    doCollision(other) {
        if(other.tag == 'player') return;
        this.kill();
    }

    move() {
        if(!this.alive) return;
        this.clear();
        this.x+= this.speed;

        // Only works for player bullets so far
        //
        if(this.x > this.canvas.width) this.kill();//this.alive = false;
    }

    draw() {
        if(!this.alive) return;
        super.draw();
    }

    kill() {
        this.clear();
        this.alive = false;
    }
}

export default Bullet;
