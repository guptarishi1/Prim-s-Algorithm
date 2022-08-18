let fr = 30;  // frame rate


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




function stdToP5(a, b, c) {
    

    if (a.length === 3) {
        return [a[1], -a[2], a[0]];   
    } else if (a.length === 6) {      
        return [a[1], -a[2], a[0], a[4], -a[5], a[3]];
    } else if (a.length === 9) {   
        return [a[4], -a[5], a[3], -a[7], a[8], -a[6], a[1], -a[2], a[0]]; 
    }
}

function p5ToStd(a) {
    if (a.length === 3) {
        return [a[2], a[0], -a[1]];   // x = z, y = x, z = -y
    } else if (a.length === 6) {
        return [a[2], a[0], -a[1], a[5], a[3], -a[4]];
    } else if (a.length === 9) {
        //return [a[6], a[7], a[8], a[0], a[1], a[2], -a[3], -a[4], -a[5]];
    }
}



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



function showFR(s) {
    const fps = s.frameRate();
    let pos = (cvw === 1200) ? 0 : 1200;
    s.fill(255);
    s.textSize(10);
    s.textAlign(s.LEFT, s.TOP);
    s.noStroke();
    s.text("FPS: " + fps.toFixed(1), pos, 10);
}

function deep_copy(x) {
    let y = [];
    for (let i = 0; i < x.length; i++) {
        y[i] = x[i];
    }
    return y;
}

function vector_multiply(x, mult) {
    let v = deep_copy(x);
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


const Scene00 = function(s) {
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