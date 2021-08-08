import { Color } from "./theme.js";

export class Star {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
}

export class Stars {
    constructor (canvasId, speed, count, maxSize, color) {
        this.speedMod = speed;
        this.speed = speed; // px/s
        this.count = count;
        this.maxSize = maxSize; // px
        this.color = color;

        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        this.stars = [];
        this.prevTimeStamp = null;
        this.requestID = null;
        this.loop = this.loop.bind(this);
    } 

    start () {
        for (let i = 0; i < this.count; i++) {
            let star = new Star(
                Math.floor(Math.random() * (this.width + 1)),
                Math.floor(Math.random() * (this.height + 1)),
                Math.floor(1 + Math.random() * (this.maxSize)));
            
            this.stars.push(star);
        }

        this.loop(performance.now());
    }

    stop () {
        this.clear();
        window.cancelAnimationFrame(this.requestID);
    }

    clear() {
        this.stars = [];
    }

    loop (timestamp) {
        this.requestID = window.requestAnimationFrame(this.loop);

        let tsDelta = timestamp - this.prevTimeStamp;
        let yDelta = 1 / 1000 * tsDelta * this.speed;

        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].y = this.stars[i].y - 1 / this.stars[i].size * yDelta;

            if (this.stars[i].y + this.stars[i].size <= 0) {
                this.stars.splice(i, 1);
            }

            while (this.stars.length > this.count) {
                this.stars.splice(i, 1);
            }
        }

        while (this.stars.length < this.count) {
            let star = new Star(
                Math.floor(Math.random() * (this.width + 1)),
                this.height,
                Math.floor(1 + Math.random() * (this.maxSize)));

            this.stars.push(star);
        }

        this.color = new Color(document.documentElement.style.getPropertyValue("--dark-accent"));
        this.prevTimeStamp = timestamp;
        this.#draw();
    }

    #draw () {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = this.color.hex;
        
        for (let star of this.stars) {
            this.context.fillRect(star.x, star.y, star.size, star.size);
        }
    }
}