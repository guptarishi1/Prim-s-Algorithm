
class Timer {
    constructor(frames) {
        this.frames = frames;
        this.f = 1;
        this.t = 0;
    }

    advance() {
    } 
}


class Timer0 extends Timer {
    constructor(frames) {
        super(frames);
        this.v = 1 / frames;
    }

    advance() {
        this.f++;
        if (this.t < 0.99) {
            this.t += this.v;
        }
        return this.t;
    }
}


class Timer1 extends Timer {
    constructor(frames) {
        super(frames);
        this.a = -2 / (frames * frames);

        
        this.v = 2 / frames - 1 / (frames * frames);
    }

    advance() {
        //It appears that controlling the eventual outcome only through mathematics may render this possible. t
        // At the end of the animation, the number is not exactly one. As a result, we must push it to 1.
        if (this.f >= this.frames)
            return 1;

        if (this.v > 0) {
            this.t += this.v;
            this.v += this.a;
        }
        (this.f)++;
        return this.t;
    }
}


class Timer2 extends Timer {
    constructor(frames) {
        super(frames);
        this.v = 0;
        this.a = 4 / (frames * frames);
    }

    advance() {
      
        if (this.f > this.frames)
            return 1;

        if (this.t < 0.5) {
            this.t += this.v;
            if (this.t < 0.5) {  
                this.v += this.a;
            }
        } else if (this.v > 0) {
            this.v -= this.a;
            this.t += this.v;
        }

        (this.f)++;
        return this.t;
    }
}


function TimerFactory(frames, mode) {
    if (mode === 0) {
        return new Timer0(frames);
    } else if (mode === 1) {
        return new Timer1(frames);
    } else if (mode === 2) {
        return new Timer2(frames);
    } else {
        return new Timer2(frames);
    }
}


class StrokeWeightTimer {
    constructor(ctx, end, strokeWeight, duration) {
        this.s = ctx;
        this.end = end;
        this.sw = strokeWeight || 4;
        this.duration = duration || 1;
        this.timer = new Timer0(frames(this.duration));
    }

    advance() {
        if (this.s.frameCount <= this.end) {
            this.s.strokeWeight(this.sw);
        } else {
            
            this.s.strokeWeight(this.sw * (1.00001 - this.timer.advance()));
        }
    }
}


class ColorChanger {
    constructor(ctx, initColor) {
        this.s = ctx;
        this.color = initColor || [255, 255, 255, 255];
    }

    fadeOut(duration) {
        let c = deep_copy(this.color);
        this.color[3] = this.color[3] !== undefined ? this.color[3] : 255;
        c[3] = 0;
        this.reColor(c, duration);
    }

    reColor(newColor, duration) {
        this.co = this.color;
        this.cd = newColor;
        this.changed = true;
        this.f = 0;
        this.duartion = frames(1);
        if (duration)
            this.duartion = frames(duration);
        this.timer = new Timer0(this.duartion);
    }

    changing() {
        if (this.f < this.duartion) {
            let t = this.timer.advance();
            let o = this.co;
            let d = this.cd;
            if (this.color[3] === undefined) {
                this.color =
                    [o[0] + t * (d[0] - o[0]), o[1] + t * (d[1] - o[1]), o[2] + t * (d[2] - o[2])];
            } else {
                this.color = [o[0] + t * (d[0] - o[0]), o[1] + t * (d[1] - o[1]),
                    o[2] + t * (d[2] - o[2]), o[3] + t * (d[3] - o[3])];
            }
            this.f++;
        } else
            this.changed = false;
    }
}


class StrokeChanger extends ColorChanger {
    constructor(ctx, initColor) {
        super(ctx, initColor);
    }

    advance() {
        if (this.changed)
            this.changing();
        this.s.stroke(this.color);
    }
}

class FillChanger extends ColorChanger {
    constructor(ctx, initColor) {
        super(ctx, initColor);
    }

    advance() {
        if (this.changed)
            this.changing();
        this.s.fill(this.color);
    }
}