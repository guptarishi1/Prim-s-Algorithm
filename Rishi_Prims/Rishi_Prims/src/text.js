
class TextBase extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        // I originally used the usual syntax of args.x || width / 2,
        // but this would not work if 0 is passed in as x
        this.rotation = args.rotation || 0;
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
    }
    // move() merged into parent class
}


class Text extends TextBase {
    constructor(ctx, args) {
        super(ctx, args);

        this.font = args.font;
        this.str = args.str;
        this.mode = args.mode || 0;
        this.color = args.color || [122, 0, 255];
        this.ft = new FillChanger(ctx, this.color);
        this.stroke = args.stroke || undefined;
        this.sw = args.strokeweight || 1.7;

        this.size = args.size || 37;
    }

    // works the same way as move()
    reColor(color, duration) {
        this.ft.reColor(color, duration);
    }

    move(x, y, duration, timerNum, size) {
        super.move(x, y, duration, timerNum);
        this.so = this.size;
        this.sn = size || this.size;
    }

    moving() {
        super.moving();
        this.size = this.so + this.move_timer.t * (this.sn - this.so);
    }

    shaking() {
        super.shaking();
        if (this.mode === 1)   // changing size only works if text is in the center
            this.size += Math.sin(this.move_timer.t * this.s.TWO_PI) * this.amp * 0.27;
    }

    jumping() {
        super.jumping();
        if (this.mode === 1)
            // the integral of sin(2*PI*x) over 0 to 2*PI is 0, so position doesn't change
            this.size += Math.sin(this.move_timer.t * this.s.TWO_PI) * this.amp * 0.2;
    }

    // works the same way as move
    change(str, duration) {
        // todo
        this.reset({ str: str });
    }

    reset(args) {
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        this.size = args.size || this.size;
        this.str = args.str || this.str;
    }

    showSetup() {
        if (this.font)
            this.s.textFont(this.font);

        if (this.mode === 0) {
            this.s.textAlign(this.s.LEFT, this.s.TOP);
        } else if (this.mode === 1) {
            this.s.textAlign(this.s.CENTER, this.s.CENTER);
        } else if (this.mode === 2) {
            this.s.textAlign(this.s.RIGHT, this.s.TOP);
        } else if (this.mode === 3) {  // center-right
            this.s.textAlign(this.s.LEFT, this.s.CENTER);
        } else if (this.mode === 4) {  // center-right
            this.s.textAlign(this.s.RIGHT, this.s.CENTER);
        }
        this.s.textSize(this.size);
        this.ft.advance();  // show color

        if (this.stroke) {
            this.s.strokeWeight(this.sw);
            this.s.stroke(this.stroke);
        } else
            this.s.noStroke();
        this.showMove();
    }

    show() {
        if (this.s.frameCount >= this.start && this.s.frameCount < this.end) {
            this.showSetup();
            this.s.fill(this.color);

            this.s.text(this.str, this.x, this.y);
        }
    }
}


class TextFade extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.initC = deep_copy(this.color);
        this.initC[3] = 0;
        if (this.color[3] === undefined)
            this.color[3] = 255;
        this.ft = new FillChanger(ctx, this.initC);

        this.duration = args.duration || 0.7;
        this.timer = new Timer0(frames(this.duration));
    }

    show() {
        if (this.s.frameCount >= this.start - 1) {
            if (this.s.frameCount === this.start)
                this.ft.reColor(this.color, this.duration);
            else if (this.s.frameCount === this.end)
                this.ft.fadeOut(this.duration);

            this.showSetup();
            this.s.text(this.str, this.x, this.y);
        }

    }

}

// does not yet support fade out
class TextWriteIn extends Text {
    constructor(ctx, args) {
        super(ctx, args);
        this.frCount = 0;
        this.len = this.str.length;
        this.txt = '';
    }
    show() {
        if (this.s.frameCount >= this.start) {
            this.showSetup();
            if (this.frCount < this.len) {
                this.txt += this.str[this.frCount];
                this.frCount++;
            }
            this.s.text(this.txt, this.x, this.y);
        }
    }
}

/***
 * todo
 */
class TextRoll extends TextFade {
    constructor(ctx, args) {
        super(ctx, args);
    }

    /**
     * @param str - could be a number
     */
    roll(str) {
        this.reset({ str: "" + str });
    }

    rolling() {

    }
}


