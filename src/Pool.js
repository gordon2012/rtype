import Entity from './Entity';

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
            entity.move();
        });
    }

    draw() {
        this.entities.forEach(entity => {
            entity.draw();
        });
    }
}

export default Pool;