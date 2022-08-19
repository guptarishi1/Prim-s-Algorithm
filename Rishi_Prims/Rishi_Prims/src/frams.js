let fr = 90;  // frame rate


let cvw = 1300;


let cvh = 1300;

let scn = 2;  
let matrix = [1, 1, 1, -1, 1, 2];
let target = [-2, 0, 3];

let Red = [255, 100, 120];
let White = [255, 77, 97];
let Yellow = [77, 217, 77];
let Orange = [77, 177, 255];
let Green = [247, 227, 47];
let Blue = [247, 137, 27];







function frames(sec) {
    return Math.round(fr * sec);
}



function setup3D(s) {
    s.frameRate(fr);
    s.pixelDensity(1);
    s.createCanvas(cvw, cvh);
}

function setup2D(s) {
    s.frameRate(fr);
    s.createCanvas(cvw, cvh);
}





function coopyD(x) {
    let y = [];
    for (let i = 0; i < x.length; i++) {
        y[i] = x[i];
    }
    return y;
}

function multiple_vect(x, mult) {
    let v = coopyD(x);
    for (let i = 0; i < v.length; i++) {
        v[i] *= mult;
    }
    return v;
}

function vector_add(x, y) {
    let v = [];
    for (let i = 0; i < x.length; i++) {
        v[i] = x[i] + y[i];
    }
    return v;
}

function vector_subtract(x, y) {
    let v = [];
    for (let i = 0; i < x.length; i++) {
        v[i] = x[i] - y[i];
    }
    return v;
}


const scenes = function(s) {
    let t = {

    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/times.ttf');
    };
    s.setup = function () {
        setup2D(s);
        s.d = new Dragger(s, []);
    };
    s.draw = function () {
        s.background(1);
        s.d.show();
    };
};