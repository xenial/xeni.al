import { Stars } from "./stars.js"
import { Color, Theme } from "./theme.js"
import { AudioWrapper } from "./audio.js"

let stars = null;
let theme = null;
let audio = null;

let playing = false;

let pathIndex = 0;
let paths = [
    "../audio/daft punk - instant crush (maahir flip).mp3",
    "../audio/cirque du soleil - alegría (sunhiausa bootleg).mp3",
    "../audio/antynarkotykowa - bezpieczne piosenki (madd bootleg).mp3",
    "../audio/curbi - superpowers (feat. helen) (fuseblade nxc).mp3",
    "../audio/era - ameno (tr!xy bootleg).mp3",
    "../audio/kda - more (stubbie bootleg).mp3",
    "../audio/rayvolt - overcome.mp3",
    "../audio/юля паршута - асталависта (nxc).mp3"
]

let audioReqID = null;

let initAudio = () => {
    audio = new AudioWrapper(paths[pathIndex]);
}

let prevSong = () => {
    pathIndex -= 1;

    if (pathIndex < 0)
        pathIndex = paths.length - 1;

    changeSong();
}

let nextSong = () => {
    pathIndex += 1;

    if (pathIndex >= paths.length)
        pathIndex = 0;

    changeSong();
}

let changeSong = () => {
    if (!audio) {
        initAudio();
    }
    audio.change(paths[pathIndex]);

    audio.audio.addEventListener("ended", () => {
        nextSong();
    })

    stars.clear();
    if (!audioReqID) {
        audioStars();
    }
    nowPlaying(true);
}

let nowPlaying = (bool) => {
    let elem = document.getElementById("nowplaying");
    if (!bool) {
        elem.innerHTML = "";
        playing = false;
        audio.pause();
    } else {
        let re = /audio\/(.*).mp3/;
        elem.innerHTML = paths[pathIndex].match(re)[1];
        playing = true;
        audio.play();
        audio.audio.volume = document.getElementById("volume").value / 100;
    }
}

let audioStars = () => {
    let loop = () => {
        audioReqID = requestAnimationFrame(loop);
        
        audio.analyser.getByteFrequencyData(audio.data);

        let sum = null;
        for (let num of audio.data) {
            sum += num;
        }
        let avg = sum / audio.data.length;

        stars.speed = stars.speedMod * avg ** 2 / 2000;
    }

    loop();
}

let audioHandler = () => {
    if (!audio) {
        initAudio();

        audio.audio.addEventListener("ended", () => {
            nextSong();
        })
    }

    if (playing == false) {
        if (audio.audio.currentTime == 0) {
            stars.clear();
        }
        audioStars();
        nowPlaying(true);
    } else {
        cancelAnimationFrame(audioReqID);
        stars.speed = stars.speedMod;
        nowPlaying(false);
    }
}

let writeClipboard = async (e) => {
    document.getElementById("notification").classList.remove("fadeout");
    await navigator.clipboard.writeText(e.currentTarget.text);
    setTimeout(() => {
        document.getElementById("notification").classList.add("fadeout");
    }, 50);
}

let themeHandler = async () => {
    await theme.randomize();
    document.getElementById("logo").contentDocument.getElementById("svg2").style.setProperty("--light-shade", theme.colors[0].hex);
    document.getElementById("logo").contentDocument.getElementById("svg2").style.setProperty("--light-accent", theme.colors[1].hex);
    document.getElementById("logo").contentDocument.getElementById("svg2").style.setProperty("--main-color", theme.colors[2].hex);
    document.getElementById("logo").contentDocument.getElementById("svg2").style.setProperty("--dark-accent", theme.colors[3].hex);
    document.getElementById("logo").contentDocument.getElementById("svg2").style.setProperty("--dark-shade", theme.colors[4].hex);
}

window.onload = () => {
    theme = new Theme(
        new Color(getComputedStyle(document.documentElement).getPropertyValue("--light-shade")),
        new Color(getComputedStyle(document.documentElement).getPropertyValue("--light-accent")),
        new Color(getComputedStyle(document.documentElement).getPropertyValue("--main-color")),
        new Color(getComputedStyle(document.documentElement).getPropertyValue("--dark-accent")),
        new Color(getComputedStyle(document.documentElement).getPropertyValue("--dark-shade"))
    );

    document.getElementById("volume").oninput = () => {
        audio.audio.volume = document.getElementById("volume").value / 100;
    }
    
    document.getElementById("logo").contentDocument.getElementById("g10").addEventListener("click", themeHandler);
    document.getElementById("playbtn").addEventListener("click", audioHandler);
    document.getElementById("prevbtn").addEventListener("click", prevSong);
    document.getElementById("nextbtn").addEventListener("click", nextSong);

    let discord = document.getElementById("discord");
    let bitcoin = document.getElementById("bitcoin");
    let ethereum = document.getElementById("ethereum");
    discord.text = "xenial#4146";
    bitcoin.text = "1HHZh8APbfM7Sbx5nMi6YQiYEUze8DmmEA";
    ethereum.text = "0xf82d7ef81d9a9f73ef47a865f9cc7d7f0c024a07";
    discord.addEventListener("click", writeClipboard);
    bitcoin.addEventListener("click", writeClipboard);
    ethereum.addEventListener("click", writeClipboard);

    let color = new Color(getComputedStyle(document.documentElement).getPropertyValue("--dark-accent"));
    stars = new Stars("starcanvas", 100, 200, 4, color);
    stars.start();
}

window.onresize = () => {
    stars.width = stars.canvas.width = window.innerWidth;
    stars.height = stars.canvas.height = window.innerHeight;
}