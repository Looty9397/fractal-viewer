// Created by Looty9397

class Color {
    constructor (red, green, blue) {
        this.red = Math.floor((0 <= red) ? ((255 >= red) ? red : 255) : 0);
        this.green =  Math.floor((0 <= green) ? ((255 >= green) ? green : 255) : 0);
        this.blue =  Math.floor((0 <= blue) ? ((255 >= blue) ? blue : 255) : 0);
    };

    intermediate (percent, col2) {
        return new Color(Math.floor((percent * this.red) + ((1 - percent) * col2.red)), Math.floor((percent * this.green) + ((1 - percent) * col2.green)), Math.floor((percent * this.blue) + ((1 - percent) * col2.blue)));
    };
};

class Fractal {
    constructor (name, algorithm, options) {
        this.name = name;
        this.algorithm = algorithm;
        this.options = options;
    };

    button () {
        let btn = document.createElement("button");
        btn.innerHTML = this.name;
        btn.addEventListener("click", function () {
            loadOptions(this.options);
        });
        btn.id = "button" + this.name;
        return btn;
    };
};