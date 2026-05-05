// Created by Looty9397

// -- Dependencies -- //

// -- Classes -- //

class Color {
    constructor (red, green, blue) {
        this.red = Math.floor((0 <= red) ? ((255 >= red) ? red : 255) : 0);
        this.green =  Math.floor((0 <= green) ? ((255 >= green) ? green : 255) : 0);
        this.blue =  Math.floor((0 <= blue) ? ((255 >= blue) ? blue : 255) : 0);
    };

    intermediate (percent, col2) {
        return new new Color(Math.floor((percent * this.red) + ((1 - percent) * col2.red)), Math.floor((percent * this.green) + ((1 - percent) * col2.green)), Math.floor((percent * this.blue) + ((1 - percent) * col2.blue)));
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
        this.options = options;
        let form = function () {
            // <box><labels><inputs><buttons></box>
            let box = document.createElement("div");
            let labels = document.createElement("div");
            let inputs = document.createElement("div");
            let buttons = document.createElement("div");
            labels.style.display = "inline-block";
            inputs.style.display = "inline-block";
            buttons.style.display = "inline-block";
            labels.style.marginRight = "10px";
            inputs.style.marginRight = "10px";
            buttons.style.marginRight = "10px";
            labels.className = "label";
            box.appendChild(labels);
            box.appendChild(inputs);
            box.appendChild(buttons);
            for (var i of options) {
                let para = document.createElement("p");
                para.innerHTML = i.name;
                labels.appendChild(para);
                let p = document.createElement("p");
                let input = document.createElement("input");
                input.type = i.type;
                input.id = i.id;
                input.value = i.def;
                p.appendChild(input);
                inputs.appendChild(p);
                if (i.type === "number") {
                    let randomBtn = document.createElement("button");
                    randomBtn.innerHTML = "Random";
                    randomBtn.className = "opts";
                    randomBtn.id = "RNG" + i.id;
                    randomBtn.addEventListener("click", function () {
                        console.log(i);
                        document.getElementById(this.id.slice(3)).value = (Math.random() * (i.bounds[1] - i.bounds[0])) + i.bounds[0];
                    });
                    let p = document.createElement("p");
                    p.appendChild(randomBtn);
                    buttons.appendChild(p);
                    input.addEventListener("change", function () {
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
            };
            let para = document.createElement("p");
            para.innerHTML = "Color Palette";
            labels.appendChild(para);
            let p = document.createElement("p");
            p.appendChild(palette());
            inputs.appendChild(p);
            let ph = document.createElement("p");
            ph.innerHTML = "&nbsp;";
            buttons.appendChild(ph);
            let applyBtn = document.createElement("button");
            applyBtn.addEventListener("click", function () {
                let ctx = canvas.getContext("2d");
                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        let opts = {};
                        for (var i of options) {
                            opts[i.id] = document.getElementById(i.id).value;
                        };
                        let iter = algorithm(x, y, opts);
                        // Color determination: loop of 60 iters, every 10 reaches next color
                        // If in between (i.e. 13), then take intermediate. col.intermediate(etc etc)
                        let pal = document.getElementById("palette");
                        let col = palettes[pal.value][Math.floor((iter % 60) / 10)]; console.log(col);
                        pixCol = col.intermediate((iter % 10) / 10, (Math.floor((iter % 60) / 10) !== palettes[pal.value].length - 1) ? palettes[pal.value][Math.floor((iter % 60) / 10) + 1] : 0);
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + 1, y);
                        ctx.stroke();
                    };
                };
            });
            let resetBtn = document.createElement("button");
            applyBtn.innerHTML = "Apply Settings";
            resetBtn.innerHTML = "Reset";
            applyBtn.className = "opts";
            resetBtn.className = "opts";
            box.appendChild(document.createElement("br"));
            box.appendChild(applyBtn);
            box.appendChild(resetBtn);
            return box;
        } ();
        this.button = function () { // Done to group similar commands. to avoid clutter. etc.
            let btn = document.createElement("button");
            btn.innerHTML = name[0];
            btn.id = "button" + name[1];
            btn.addEventListener("click", () => { // Only using this to preserve this's reference to the object
                document.getElementById("options").innerHTML = "";
                document.getElementById("options").appendChild(form);
            });
            btn.className = "navbar";
            return btn;
        } ();
    };
};

// -- Functions -- //

function palette () {
    let pal = document.createElement("select");
    pal.id = "palette";
    for (let i = 0; i < palettes.length; i++) {
        let j = document.createElement("option");
        j.value = i;
        j.innerHTML = palettes[i][0];
        pal.appendChild(j);
    };
    return pal;
};

// -- Variables -- //

var canvas = document.getElementById("image");
canvas.width = Math.floor(window.innerWidth * 0.5);
canvas.height = Math.floor(canvas.width * (5 / 6));
canvas.style.marginTop = "10px";

var palettes = [
    ["Default", new Color(255, 0, 0), new Color(255, 255, 0), new Color(0, 255, 0), new Color(0, 255, 255), new Color(0, 0, 255), new Color(255, 0, 255)],
    ["Muted", new Color(192, 64, 64), new Color(192, 192, 64), new Color(64, 192, 64), new Color(64, 192, 192), new Color(64, 64, 192), new Color(192, 64, 192)]
];

fractals = [
    new Fractal(["Mandelbrot Set", "mandelbrot"], function (x, y, o) {
        o.z = o.z / 100;
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
        return (iter < maxIters) ? iter : -1;
    }, [
        new Opt("number", "z", "Zoom (%)", 1, [1, Infinity]),
        new Opt("number", "d", "Multibrot Degree", 2, [0.1, 10])
    ]),
    new Fractal(["Julia Set", "julia"], function (x, y, o) {
        o.z = o.z / 100;
        // o.z = zoom, o.n is similar to o.d for mandebrot, o.cx and o.cy are a complex number.
        let R = 0; // escape radius. equal to the 4 in "<= 4" of mandelbrot. since thats actually 2^2
        while (R <= 0 || (Math.pow(R, o.n) - R) < Math.sqrt(Math.pow(o.cx, 2) + Math.pow(o.cy, 2))) {
            R += 0.1;
        let point = Complex((((x / canvas.width) * R * 2) - R) * (1 / o.z), (((y / canvas.height) * R * 2) - R) * (1 / o.z));
        };
        let iter = 0; let maxIters = 100;
        while (Math.pow(point.re, 2) + Math.pow(point.im, 2) < Math.pow(R, 2) && iter < maxIters) {
            let a = Math.pow(Math.pow(point.re, 2) + Math.pow(point.im, 2), o.n / 2) * Math.cos(o.n * Math.atan2(point.im, point.re)) + o.cx;
            point.im = Math.pow(Math.pow(point.re, 2) + Math.pow(point.im, 2), o.n / 2) * Math.sin(o.n * Math.atan2(point.im, point.re)) + o.cy;
            point.re = a;
            iter += 1;
        };
        return (iter < maxIters) ? iter : -1;
    }, [
        new Opt("number", "z", "Zoom (%)", 1, [1, Infinity]),
        new Opt("number", "n", "Multijulia Degree", 2, [0.1, 10]),
        new Opt("number", "cx", "Real Part of c", -0.5, [-2, 0.25]),
        new Opt("number", "cy", "Imaginary Part of c", 0.5, [-1, 1])
    ]),
    new Fractal(["Burning Ship", "bship"], function () {

    }, [

    ])
];

// -- Functionality -- //

for (var i of fractals) {
    document.getElementById("navbar").appendChild(i.button);
    i.button.style.width = (1 / fractals.length) * 100 + "%";
};
