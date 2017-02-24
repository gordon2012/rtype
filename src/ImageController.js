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

export default ImageController;
