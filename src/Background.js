import Drawable from './Drawable';

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

export default Background;
