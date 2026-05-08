// Created by Looty9397

// -- Dependencies -- //

// -- Classes -- //

class Color {
    constructor (red, green, blue) {
        this.red = Math.floor((0 <= red) ? ((255 >= red) ? red : 255) : 0);
        this.green =  Math.floor((0 <= green) ? ((255 >= green) ? green : 255) : 0);
        this.blue =  Math.floor((0 <= blue) ? ((255 >= blue) ? blue : 255) : 0);
        this.rgb = "rgb(" + this.red.toString() + ", " + this.green.toString() + ", " + this.blue.toString() + ")";
        this.hex = "#" + hexByte(this.red) + hexByte(this.green) + hexByte(this.blue);
    };

    inter (percent, col2) {
        return new Color(Math.floor((percent * col2.red) + ((1 - percent) * this.red)), Math.floor((percent * col2.green) + ((1 - percent) * this.green)), Math.floor((percent * col2.blue) + ((1 - percent) * this.blue)));
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
    constructor (name, algorithm, options, bonds) {
        this.algorithm = algorithm;
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
                input.addEventListener("change", function () {
                    draw(opts, algo);
                });
                p.appendChild(input);
                inputs.appendChild(p);
                if (i.type === "number") {
                    let bounds = i.bounds;
                    let randomBtn = document.createElement("button");
                    randomBtn.innerHTML = "Random";
                    randomBtn.className = "opts";
                    randomBtn.id = "RNG" + i.id;
                    randomBtn.addEventListener("click", function () {
                        document.getElementById(this.id.slice(3)).value = (Math.random() * (bounds[1] - bounds[0])) + bounds[0];
                        draw(opts, algo);
                    });
                    let p = document.createElement("p");
                    p.appendChild(randomBtn);
                    buttons.appendChild(p);
                    input.addEventListener("change", function () {
                        if (this.value > bounds[1]) {
                            this.value = bounds[1];
                        } else if (this.value < bounds[0]) {
                            this.value = bounds[0]
                        };
                    });
                } else if (i.type === "range") {
                    let bounds = i.bounds;
                    input.min = bounds[0]; input.max = bounds[1];
                    let randomBtn = document.createElement("button");
                    randomBtn.innerHTML = "Random";
                    randomBtn.className = "opts";
                    randomBtn.id = "RNG" + i.id;
                    randomBtn.addEventListener("click", function () {
                        document.getElementById(this.id.slice(3)).value = (Math.random() * (bounds[1] - bounds[0])) + bounds[0];
                        draw(opts, algo);
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
            // Palette box
            let para = document.createElement("p");
            para.innerHTML = "Color Palette";
            labels.appendChild(para);
            let p = document.createElement("p");
            p.appendChild(palette());
            inputs.appendChild(p);
            let ph = document.createElement("p");
            let resetBtn = document.createElement("button");
            resetBtn.innerHTML = "Reset";
            resetBtn.className = "opts";
            resetBtn.addEventListener("click", function () {
                for (var i of options) {
                    document.getElementById(i.id).value = i.def;
                };
                center = [0, 0];
                draw(opts, algo);
            });
            ph.appendChild(resetBtn);
            buttons.appendChild(ph);
            box.appendChild(document.createElement("br"));
            return box;
        } ();
        this.button = function (obj) { // Done to group similar commands. to avoid clutter. etc.
            let btn = document.createElement("button");
            btn.innerHTML = name[0];
            btn.id = "button" + name[1];
            btn.addEventListener("click", () => { // Only using this to preserve this's reference to the object
                document.getElementById("options").innerHTML = "";
                document.getElementById("options").appendChild(form);
                opts = obj.options; algo = obj.algorithm;
                draw(opts, algo);
            });
            btn.className = "navbar";
            return btn;
        } (this);
    };
};

// -- Functions -- //

function palette () {
    let pal = document.createElement("select");
    pal.id = "palette";
    for (let i = 0; i <palettes.length; i++) {
        let j = document.createElement("option");
        j.value = i;
        j.innerHTML = palettes[i].name;
        pal.appendChild(j);
    };
    return pal;
};

function hexByte (value) {
    value = value.toString(16);
    if (value.length === 1) {
        value = "0" + value;
    };
    return value;
};

function draw (options, algorithm) {
    let ctx = canvas.getContext("2d");
    for (let x = 0; x < canvas.width / res; x++) {
        for (let y = 0; y < canvas.height / res; y++) {
            let opts = {};
            for (var i of options) {
                opts[i.id] = document.getElementById(i.id).value;
            };
            let iter = algorithm(x * res, y * res, opts);
            // Color determination: loop of 60 iters, every 10 reaches next color
            // If in between (i.e. 13), then take inter. col.inter(etc etc)
            let pixCol;
            if (iter >= 0) {
                let pal = document.getElementById("palette");
                let col = palettes[Number(pal.value)]["cols"][Math.floor((iter % 60) / 10)];
                pixCol = col.inter((iter % 10) / 10, palettes[pal.value]["cols"][(Math.floor((iter % 60) / 10) !== palettes[pal.value]["cols"].length - 1) ? Math.floor((iter % 60) / 10) + 1 : 0]);
            } else {
                pixCol = new Color(0, 0, 0);
            };
            ctx.fillStyle = pixCol.hex;
            ctx.fillRect(x * res, y * res, res, res);
        };
    };
};

// -- Variables -- //

var res = 2;

var canvas = document.getElementById("image");
canvas.width = Math.floor(window.innerWidth * (0.5 / res)) * res;
canvas.height = Math.floor(canvas.width * ((5 / res) / 6)) * res;
canvas.style.marginTop = "10px";
canvas.addEventListener("click", function () {
    let rect = canvas.getBoundingClientRect();
    center = [
        center[0] + ((event.clientX - rect.left - (canvas.width / 2))),
        center[1] + ((event.clientY - rect.top - (canvas.height / 2)))
    ];
    draw(opts, algo);
});

var center = [0, 0];
var algo; var opts;

var palettes = [
    {
        "name": "Default",
        "cols": [
            new Color(255, 0, 0),
            new Color(255, 255, 0),
            new Color(0, 255, 0),
            new Color(0, 255, 255),
            new Color(0, 0, 255),
            new Color(255, 0, 255)
        ]
    },
    {
        "name": "Muted",
        "cols": [
            new Color(192, 64, 64),
            new Color(192, 192, 64),
            new Color(64, 192, 64),
            new Color(64, 192, 192),
            new Color(64, 64, 192),
            new Color(192, 64, 192)
        ]
    },
    {
        "name": "Dim",
        "cols": [
            new Color(128, 0, 0),
            new Color(128, 128, 0),
            new Color(0, 128, 0),
            new Color(0, 128, 128),
            new Color(0, 0, 128),
            new Color(128, 0, 128)
        ]
    },
    {
        "name": "Bright",
        "cols": [
            new Color(255, 128, 128),
            new Color(255, 255, 128),
            new Color(128, 255, 128),
            new Color(128, 255, 255),
            new Color(128, 128, 255),
            new Color(255, 128, 255)
        ]
    }
];

fractals = [ // It would be nice to get the zoom centered on your chosen center point,
    // so a zoom on the flames of the Burning Ship wouldn't be at [-41439.0625, -1126.5625] with 100x zoom (10000%)
    // but I don't even know where to start looking for the thing I'd need to change to make that possible.
    new Fractal(["Mandelbrot Set", "mandelbrot"], function (x, y, o) {
        o.z = Math.pow(1.1, o.z - 1)
        // [-2, 1], [-1.25, 1.25], o = options
        // what should go in each slot? difficult question. must be scaled to the bounds. percent in canvas = x / canvas.width. * 1 - (-2) = * 3, -2 because starts there. same for y but 1.25 - (-1.25) = * 2.5, -1.25
        // And Now To Add In Scaling! zoom exists as a % sooo. multiplier if 200% should be 0.5. *(1 /z) z = zoom
        let point = Complex(((((x + center[0]) / canvas.width) * 3) - 2) / o.z, ((((y + center[1]) / canvas.height) * 2.5) - 1.25) / o.z);
        let a = 0; let b = 0; let iter = 0; let maxIters = 100 * ((o.z < 2) ? o.z : o.z / 2); // a number; scaled by the zoom level for performance
        while (Math.pow(a, o.d) + Math.pow(b, o.d) <= Math.pow(2, o.d) && iter < maxIters) {
            let a1 = Math.pow(a, o.d) - Math.pow(b, o.d) + point.re;
            b = (2 * a * b) + point.im;
            a = a1;
            iter += 1;
        }; // Unintentional obfuscation = WWW
        return (iter < maxIters) ? iter : -1;
    }, [
        new Opt("range", "z", "Zoom (x)", 1, [1, 100]),
        new Opt("number", "d", "Multibrot Degree", 2, [0.1, 10])
    ], [[-2, 1], [-1.25, 1.25]]),
    new Fractal(["Burning Ship Fractal", "bship"], function (x, y, o) {
        o.z = Math.pow(1.1, o.z - 1)
        let point = Complex(((((x + center[0]) / canvas.width) * 3) - 2) / o.z, ((((y + center[1]) / canvas.height) * 2.5) - 1.25) / o.z);
        let a = 0; let b = 0; let iter = 0; let maxIters = 100; // a number; scaled by the zoom level for performance
        while (Math.pow(a, o.d) + Math.pow(b, o.d) <= Math.pow(2, o.d) && iter < maxIters) {
            let a1 = Math.pow(a, o.d) - Math.pow(b, o.d) + point.re;
            b = Math.abs(2 * a * b) + point.im;
            a = a1;
            iter += 1;
        }; // Unintentional obfuscation = WWW
        return (iter < maxIters) ? iter : -1;
    }, [
        new Opt("range", "z", "Zoom (x)", 1, [1, 100]),
        new Opt("number", "d", "Multibrot Degree", 2, [0.1, 10])
    ], [[-2, 1], [-1.25, 1.25]])
];

// -- Functionality -- //

for (var i of fractals) {
    document.getElementById("navbar").appendChild(i.button);
    i.button.style.width = (1 / fractals.length) * 100 + "%";
};
