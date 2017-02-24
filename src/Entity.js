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

    move() {

    }

    draw() {

    }
}

export default Entity;
