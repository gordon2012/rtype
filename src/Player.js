import Drawable from './Drawable';
import Pool from './Pool';
import Bullet from './Bullet';

class Player extends Drawable {
    constructor(game, input, x, y, speed, canvas, image) {
        // TODO: speed as object with acceleration and maxVelocity?
        super(x, y, canvas, image);
        this.speed = speed;
        this.cooldown = 0;

        this.isCollider = true;
        this.tag = 'player';

        this.game = game
        this.input = input;

        this.pool = new Pool();
        this.game.addEntity(this.pool);
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

        this.x += this.speed * (this.input.right - this.input.left);
        this.y += this.speed * (this.input.down - this.input.up);

        this.x = Math.min(this.canvas.width - w, Math.max(0, this.x));
        this.y = Math.min(this.canvas.height - h/2, Math.max(-h/2, this.y));

        if(this.input.shoot && this.cooldown == 0) {
            this.cooldown = 15;
            this.pool.add(new Bullet(this.x + w/2, this.y + h/2 - 6  , 'canvas.player-pool', 15, this.game.images.loadImage('laserGreen10.png')));
        }
        this.cooldown = Math.max(0, this.cooldown - 1);
    }
}

export default Player;
