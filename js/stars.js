let noise = 0.2,    // y delta variance %
delta = 0.1,          // y delta
count = 50,        // stars per 1920*1080
sizes = 4;          // star size count

count /= (1920 * 1080);

// star array
const stars = [];

// get viewport area
let getVPArea = () => {
    return (window.innerWidth * window.innerHeight);
}

// generate star with random size and speed
let generateStar = (_x, _y) => {
    sz = Math.floor(Math.random() * sizes) + 1;
    return {
        size: sz,
        speed: Math.random() * noise + (delta - delta * (noise / 2)) / sz,
        pos: {x: _x, y: _y}
    };
}

// generate a star with randomized positions and push to array
let addRandStar = () => {
    let star = generateStar(
        0,
        Math.floor(Math.random() * (window.innerHeight + 1))
        );

    star.pos.x = Math.floor(Math.random() * (window.innerWidth + 1 - star.size));
    stars.push(star);
}

// populate array with stars
let initStars = () => {
    for (let i = 0; i < Math.floor(count * getVPArea()); i++) addRandStar();
}

// update stars
let updateStars = () => {
    let ccount = Math.floor(count * getVPArea());

    // remove excess stars
    while (stars.length > ccount) stars.pop();

    // add missing stars
    while (stars.length < ccount) addRandStar();

    //clamp stars
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (star.pos.x + star.size > window.innerWidth) star.pos.x = Math.random() * (window.innerWidth + 1 - star.size);
        if (star.pos.y > window.innerHeight) star.pos.y = Math.random() * (window.innerHeight + 1);
    }

    // move & reset stars
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.pos.y -= star.speed;
        if (star.pos.y < 0) {
            ns = generateStar(Math.random() * (window.innerWidth + 1), window.innerHeight);
            star.pos = ns.pos;
            star.size = ns.size;
            star.speed = ns.speed;
        }
    }
}

// main animation loop
let draw = () => {
    updateStars();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.beginPath();
        ctx.rect(star.pos.x, star.pos.y, star.size, star.size);
        ctx.fillStyle = "#555555";
        ctx.fill();
    }

    window.requestAnimationFrame(draw);
}

// initialize canvas
let canvas = document.getElementById("stars");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

// initialize stars
initStars();

// start loop
window.requestAnimationFrame(draw);