

class Line {
    constructor(ctx, args) {
        this.s = ctx;
        this.x1 = args.x1 || 0;
        this.y1 = args.y1 || 0;
        this.x2 = args.x2 || 0;
        this.y2 = args.y2 || 0;
        this.duration = args.duration || 1;
        //this.mode = args.mode || 2;

        // starting frame for initialization animation
        this.start = args.start || 1;
        this.strokeweight = args.strokeweight || 3;
        this.st = new StrokeChanger(this.s, args.color);

        this.timer = new TimerFactory(frames(this.duration), args.mode);

        this.end = args.end || 100000;
        this.timer_sw = new StrokeWeightTimer(this.s, this.end, this.strokeweight, 0.7);
    }

    
    shift(x1, y1, x2, y2, duration) {
        let na = {
            x1: this.x1 + x1, x2: this.x2 + x2, y1: this.y1 + y1, y2: this.y2 + y2,
            duration: duration
        };
        this.move(na);
    }

    
    move(args) {
        this.x1o = this.x1;
        this.x2o = this.x2;
        this.y1o = this.y1;
        this.y2o = this.y2;
        this.x1d = args.x1 || this.x1;
        this.x2d = args.x2 || this.x2;
        this.y1d = args.y1 || this.y1;
        this.y2d = args.y2 || this.y2;
        this.moved = true;
        let t = args.duration || 1;
        let m = args.mode === undefined ? 2 : args.mode;

        this.move_timer = new TimerFactory(frames(t), m);
    }

    moving() {
        let t = this.move_timer.advance();
        this.reset({
            x1: this.x1o + t * (this.x1d - this.x1o), x2: this.x2o + t * (this.x2d - this.x2o),
            y1: this.y1o + t * (this.y1d - this.y1o), y2: this.y2o + t * (this.y2d - this.y2o),
        })
    }

    reset(args) {
        this.x1 = args.x1 || this.x1;
        this.y1 = args.y1 || this.y1;
        this.x2 = args.x2 || this.x2;
        this.y2 = args.y2 || this.y2;
    }

    showSetup() {
        this.st.advance();
        this.timer_sw.advance();
        if (this.moved)
            this.moving();
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            let t = this.timer.advance();
            this.s.line(this.x1, this.y1,
                this.x1 + (this.x2 - this.x1) * t, this.y1 + (this.y2 - this.y1) * t);
        }
    }
}



class Arrow extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.duration = args.duration || 1;

        this.fadeIn = args.fadeIn || false;
        if (this.fadeIn) {
            this.colorArr = args.colorArr || [255, 255, 255];
            this.timer = new Timer0(frames(this.duration));
        } else {
            this.timer = new Timer2(frames(this.duration));
        }
        //this.fadeOut = args.fadeOut || false;

        // define tip length/angle for all vectors on this canvas
        this.tipLen = args.tipLen || 1;
        this.tipAngle = args.tipAngle || 0.4;  // this is in radians

        let t = Arrow.setArrow(this.x1, this.y1, this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }

    // reset the start and end points of the arrow
    reset(args) {
        super.reset(args);
        let t = Arrow.setArrow(this.x1, this.y1, this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }


    // I could have used arctan() to first obtain the angle of the arrow, then calculate the
    // angle of the two line segments, and finally get their coordinates.
    // However, arctan() will discard information about how the arrow is oriented (domain -90 ~ 90)
    // so I use another strategy: first scale the original line, then apply the rotation matrix.
    static setArrow(x1, y1, x2, y2, tipLen, tipAngle) {
        let dx = x1 - x2;    // note it's x1 - x2
        let dy = y1 - y2;

        let len = Math.sqrt(dx * dx + dy * dy);

        // calculate the position
        let x = dx / len * tipLen;
        let y = dy / len * tipLen;

        let sin_theta = Math.sin(tipAngle);
        let cos_theta = Math.cos(tipAngle);

        // x1, x2 are the coordinates of start point and end point; arrow points from x1 to x2.
        // x3, x4 are the endpoints of the two lines originating from x2 that draw the arrow.
        // Ditto for y3 and y4.
        let x3 = x2 + cos_theta * x - sin_theta * y;
        let y3 = y2 + sin_theta * x + cos_theta * y;
        let x4 = x2 + cos_theta * x + sin_theta * y;
        let y4 = y2 + cos_theta * y - sin_theta * x;
        return [x3, y3, x4, y4];
    }

    showFadeIn() {
        let t = this.timer.advance() * 255;
        this.s.stroke(this.colorArr[0], this.colorArr[1], this.colorArr[2], t);
        this.s.strokeWeight(this.strokeweight);

        this.s.line(this.x1, this.y1, this.x2, this.y2);
        this.s.line(this.x2, this.y2, this.x3, this.y3);
        this.s.line(this.x2, this.y2, this.x4, this.y4);
    }

    static showArrow(obj, t) {  // // show the two line segments at the tip; also used by ArcArrow
        let dx3 = obj.x3 - obj.x2;
        let dy3 = obj.y3 - obj.y2;
        obj.s.line(obj.x2, obj.y2, obj.x2 + t * dx3, obj.y2 + t * dy3);

        let dx4 = obj.x4 - obj.x2;
        let dy4 = obj.y4 - obj.y2;
        obj.s.line(obj.x2, obj.y2, obj.x2 + t * dx4, obj.y2 + t * dy4);
    }
    
    showGrow() {
        // show the main line
        let dx2 = this.x2 - this.x1;
        let dy2 = this.y2 - this.y1;
        this.showSetup();

        // 2019-01-26 BUG FIX: no wonder why the display of arrows appears 6 times slower...
        let t = this.timer.advance();

        this.s.line(this.x1, this.y1, this.x1 + t * dx2, this.y1 + t * dy2);

        Arrow.showArrow(this, t);
    }

    show() {
        if (this.s.frameCount > this.start) {
            if (this.fadeIn) {
                this.showFadeIn();
            } else {
                this.showGrow();
            }
        }
        if (this.fadeOut && this.s.frameCount > this.end) {

        }
    }
}



class Pie extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.a1 = args.a1 || 0;
        this.a2 = args.a2 || 6.283;

        this.r = args.r || 100;
        this.timer = new Timer1(frames(this.duration));
        this.st = new StrokeChanger(this.s, args.color);
        this.fill = args.fill || undefined;
        if (this.fill)
            this.ft = new FillChanger(this.s, args.fill);

        this.strokeweight = args.strokeweight || 3;
        this.timer_sw = new StrokeWeightTimer(this.s, this.end, this.strokeweight, 0.7);
    }

    showSetup() {
        this.showMove();
        if (this.fill) {
            this.ft.advance();
        } else
            this.s.noFill();

        this.st.advance();
        this.timer_sw.advance();
    }

    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            this.s.arc(this.x, this.y, this.r, this.r,
                this.a1, this.a1 + (this.a2 - this.a1) * this.timer.advance());
        }
    }
}



class Arc extends Pie {
    constructor(ctx, args) {
        super(ctx, args);
        this.n = args.detail || 27;  // number of segments - 1
        this.p = [];
        let a = this.a1;
        let da = (this.a2 - this.a1) / (this.n - 1);  // number of anchor points = # segment + 1
        for (let i = 0; i < this.n; i++) {
            let x = this.x + this.r * Math.cos(a), y = this.y + this.r * Math.sin(a);
            a += da;
            this.p[i] = [x, y];
        }
    }
    
    showArc(t) {
        this.s.beginShape();
        this.showSetup();
        for (let i = 0; i < this.n * t; i++) {
            this.s.vertex(this.p[i][0], this.p[i][1]);
        }
        this.s.endShape();
    }
    
    show() {
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.showArc(t);
        }
    }
}

class ArcArrow extends Arc {
    constructor(ctx, args) {
        super(ctx, args);
        this.tipLen = args.tipLen || 12;
        this.tipAngle = args.tipAngle || 0.3;
        
        this.x2 = this.p[this.n - 1][0];
        this.y2 = this.p[this.n - 1][1] - 1;  // fixme
        let dx = this.x2 - this.x, dy = this.y2 - this.y;
        let t = Arrow.setArrow(this.x2 - dy, this.y2 + dx - this.strokeweight,
            this.x2, this.y2, this.tipLen, this.tipAngle);
        this.x3 = t[0];
        this.y3 = t[1];
        this.x4 = t[2];
        this.y4 = t[3];
    }

    show() {
        if (this.s.frameCount > this.start) {
            let t = this.timer.advance();
            this.showArc(t);
            Arrow.showArrow(this, t);
        }
    }
}



class Circle extends Pie {
    constructor(ctx, args) {
        super(ctx, args);
    }
    show() {
        if (this.s.frameCount > this.start) {
            this.showSetup();
            this.s.arc(this.x, this.y, this.r, this.r, 0, 6.283 * this.timer.advance());
        }
    }
}
