// Created by Looty9397

// -- Classes -- //

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
        this.algorithm = algorithm; // Function taking a complex number and returning a color.
        this.options = options; // Array containing information. [[label, type, min, max]]. min and max optional if (type != number) {};
        this.button = document.createElement("button");
        this.button.innerHTML = name;
        this.button.id = "button" + name;
        this.button.addEventListener("click", () => { // Only using this to preserve this's reference to the object
            document.getElementById("options").innerHTML = "";
            document.getElementById("options").appendChild(this.form);
        });
        this.form = function () {
            // <box><labels><inputs><buttons></box>
            let box = document.createElement("div");
            let labels = document.createElement("div");
            let inputs = document.createElement("div");
            let buttons = document.createElement("div");
            labels.style.display = "inline-block";
            inputs.style.display = "inline-block";
            buttons.style.display = "inline-block";
            box.appendChild(labels);
            box.appendChild(inputs);
            box.appendChild(buttons);
            for (var i of this.options) {
                let para = document.createElement("p");
                para.innerText = i[0];
                labels.appendChild(para);
                let input = document.createElement("input");
                input.type = i[1];
                input.id = i[0];
                inputs.appendChild(input);
                if (this.options[0] === "number") {
                    let randomBtn = document.createElement("button");
                    randomBtn.innerHTML = "Random";
                    randomBtn.addEventListener("click", function () {
                        document.getElementById(i[0]).value = (Math.random() * (i[3] - i[2])) + i[2];
                    });
                    let p = document.createElement("p");
                    p.appendChild(randomBtn);
                    buttons.appendChild(p);
                } else {
                    let p = document.createElement("p");
                    p.innerHTML = "&nbsp;";
                    buttons.appendChild(p);
                };
            };
            let applyBtn = document.createElement("button");
            let resetBtn = document.createElement("button");
            applyBtn.innerHTML = "Apply Settings";
            resetBtn.innerHTML = "Reset";
            box.appendChild(applyBtn);
            box.appendChild(resetBtn);
            return box;
        } ();
    };

    render () {

    }
};

// -- Variables -- //

var canvas = document.getElementById("image");
canvas.width = Math.floor(window.innerWidth - 25);
canvas.height = Math.floor(window.innerHeight * 0.66);
canvas.style.marginTop = "10px";

fractals = [
    new Fractal("Mandelbrot Set", "mandelbrot", function () {}, []),
    new Fractal("Julia Set", "julia", function () {}, []),
    new Fractal("Burning Ship", "bship", function () {}, [])
]

// -- Functionality -- //