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

class Opt {
    constructor (type, id, name, def, bounds) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.def = def;
        this.bounds = bounds;
    };
};

class Fractal {
    constructor (name, algorithm, options) {
        this.algorithm = algorithm; // Function taking x and y values and returning a number representing iterations.
        this.options = options; // Option() data type
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
                para.innerText = i.name;
                labels.appendChild(para);
                let input = document.createElement("input");
                input.type = i.type;
                input.id = i.id;
                inputs.appendChild(input);
                if (i.type === "number") {
                    let randomBtn = document.createElement("button");
                    randomBtn.innerHTML = "Random";
                    randomBtn.addEventListener("click", function () {
                        document.getElementById(i.id).value = (Math.random() * (i.bounds[1] - i.bounds[0])) + i.bounds[0];
                    });
                    let p = document.createElement("p");
                    p.appendChild(randomBtn);
                    buttons.appendChild(p);
                    document.getElementById(i.id).addEventListener("change", function () {
                        if (this.value > i.bounds[1]) {
                            this.value = i.bounds[1];
                        } else if (this.value < i.bounds[0]) {
                            this.value = i.bounds[0]
                        };
                    });
                } else {
                    let p = document.createElement("p");
                    p.innerHTML = "&nbsp;";
                    buttons.appendChild(p);
                };
                document.getElementById(i.id).value = i.def;
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
        ctx = canvas.getContext("2d");
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                iter = this.algorithm(x, y, this.getOpts());
            };
        };
    };

    getOpts () {
        opts = {};
        for (var i of this.options) {
            opts[i.id] = document.getElementById(i.id).value;
        };
        return opts;
    };
};

// -- Variables -- //

var canvas = document.getElementById("image");
canvas.width = Math.floor(window.innerWidth * 0.5);
canvas.height = Math.floor(canvas.width * (5 / 6));
canvas.style.marginTop = "10px";

fractals = [
    new Fractal("Mandelbrot Set", "mandelbrot", function (x, y, o) {
        // [-2, 1], [-1.25, 1.25], o = options
        // what should go in each slot? difficult question. must be scaled to the bounds. percent in canvas = x / canvas.width. * 1 - (-2) = * 3, -2 because starts there. same for y but 1.25 - (-1.25) = * 2.5, -1.25
        // And Now To Add In Scaling! zoom exists as a % sooo. multiplier if 200% should be 0.5. *(1 /z) z = zoom
        let point = Complex((((x / canvas.width) * 3) - 2) * (1 / o.z), (((y / canvas.height) * 2.5) - 1.25) * (1 / o.z));
        let a = 0; let b = 0; let iter = 0; let maxIters = 100; // a number; scaled by the zoom level for performance
        while (Math.pow(a, o.d) + Math.pow(b, o.d) <= 4 && iter < maxIters) {
            let a1 = Math.pow(a, o.d) - Math.pow(b, o.d) + point.re;
            b = (2 * a * b) + point.im;
            a = a1;
            iter += 1;
        }; // Unintentional obfuscation = WWW
        return iter;
    }, [
        new Opt("number", "z", "Zoom (%)", 1, [1, Infinity]),
        new Opt("number", "d", "Multibrot Power", 2, [0, 10])
    ]),
    new Fractal("Julia Set", "julia", function () {}, []),
    new Fractal("Burning Ship", "bship", function () {}, [])
];

// -- Functionality -- //

for (var i of fractals) {
    document.getElementById("navbar").appendChild(i.button);
    i.button.style.width = Math.floor((1 / fractals.length) * 100) + "%";
};