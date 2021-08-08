export class Color {
    constructor(hex, g, b) {
        if (arguments.length == 3) {
            this.rgb = {
                r: hex, 
                g: g, 
                b: b
            }

            this.hex = this.#rgbToHex(hex, g, b);
        } else {
            this.hex = hex;
            this.rgb = this.#hexToRgb(hex);
        }
    }

    #componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    #rgbToHex(r, g, b) {
        return "#" + this.#componentToHex(r) + this.#componentToHex(g) + this.#componentToHex(b);
    }

    #hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }
}

export class Theme {
    constructor(c1, c2, c3, c4, c5) {
        this.colors = [c1, c2, c3, c4, c5];

        this.update();
    }

    set(c1, c2, c3, c4, c5) {
        this.colors = [c1, c2, c3, c4, c5];

        this.update();
    }

    update() {
        document.documentElement.style.setProperty("--light-shade", this.colors[0].hex);
        document.documentElement.style.setProperty("--light-accent", this.colors[1].hex);
        document.documentElement.style.setProperty("--main-color", this.colors[2].hex);
        document.documentElement.style.setProperty("--dark-accent", this.colors[3].hex);
        document.documentElement.style.setProperty("--dark-shade", this.colors[4].hex);
    }

    async randomize() {
        let response = await fetch("http://colormind.io/api/", {
            method: "POST",
            body: JSON.stringify({model: "ui"})
        })

        let json = await response.json();
        for (let i = 0; i < json.result.length; i++) {
            let color = new Color(
                json.result[i][0],
                json.result[i][1],
                json.result[i][2])

            this.colors[i] = color;
        }

        this.update();
    }
}