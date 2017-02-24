import Entity from './Entity';

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

export default Drawable;
