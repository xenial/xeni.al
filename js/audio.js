export class AudioWrapper {
    constructor (src) {
        this.init(src)
    }

    play () {
        this.audio.play();
    }

    init (src) {
        this.audio = new Audio(src);
        this.audio.volume = 0.3;
        this.context = new window.AudioContext();
        this.analyser = this.context.createAnalyser();
        this.audioSrc = this.context.createMediaElementSource(this.audio);
        this.audioSrc.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.analyser.fftSize = 32;
        this.bufferLen = this.analyser.frequencyBinCount;
        this.data = new Uint8Array(this.bufferLen);
    }

    change(src) {
        this.pause();
        this.init(src);
    }

    pause () {
        this.audio.pause();
    }
}