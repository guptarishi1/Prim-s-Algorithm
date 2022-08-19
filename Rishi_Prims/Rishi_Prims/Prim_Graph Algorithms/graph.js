
class grph extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.f = 82;   // how many frames are needed to advance one stage of the algorithm
        this.begin = args.begin || 100;

       
        this.finished = false;

        this.V = args.V;
        this.n = this.V.length;  // here  n  is the number of nodes
        this.E = args.E;
        this.m = this.E.length;  // here m is the number of edges

     
        this.A = [];   // this 2D list keeps the track of adjesent nodes;

        this.edges = [];  // this helps to store the edge 
       
        for (let i = 0; i < this.n; i++) {
            this.A[i] = [];
            this.edges[i] = [];
        }
        this.dur = args.duration || 1.7;
        this.yOffset = args.yOffset === undefined ? -5 : args.yOffset;   
        this.radius = args.radius || (args.label ? 68 : 56);  // size of radius is mentioned

        this.nodes = [];  // stores Node objects
        for (let i = 0; i < this.n; i++) {
            this.nodes[i] = args.label ? new NodeLabel(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.38,
                start: this.start + frames(this.dur) * i / this.n, size: args.size || 38,
                str: "" + i, font: args.font, color: args.color_v, r: this.radius,
                label: args.label
            }) : new Node(this.s, {
                x: this.V[i][0], y: this.V[i][1], yOffset: this.yOffset, duration: 0.38,
                // show all nodes within this.dur secondss
                start: this.start + frames(this.dur) * i / this.n, size: args.size || 41,
                str: "" + i, font: args.font, color: args.color_v, r: this.radius,
            });
        }
    }
    show() {
        // In undirected weighted graphs, decrease to avoid the label being overwritten.
        for (let i = this.n - 1; i >= 0; i--)
            for (let j = this.n - 1; j >= 0; j--)
                if (this.edges[i][j])
                    this.edges[i][j].show();

        for (let n of this.nodes) n.show();
    }
}


class Node extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.r = args.r || 57;
        this.sw = args.strokeweight || 2;
        this.color = args.color || Blue;
        this.yOffset = args.yOffset || -4;
        this.fill = args.fill || vector_multiply(this.color, 0.14);

        this.c = new Circle(this.s, {
            x: this.x, y: this.y, r: this.r, start: this.start, end: this.end,
            duration: this.duration, strokeweight: this.sw, color: this.color, fill: this.fill
        });

        this.txt = new TextFade(this.s, {
            x: this.x, y: this.y + this.yOffset, size: args.size || 42,
            start: this.start, font: args.font, mode: 1, str: args.str,
        })
    }

    move(x, y, dur, timerNum) {
        this.c.move(x, y, dur, timerNum);
        this.txt.move(x, y, dur, timerNum);
    }

    relabel(txt) {
        this.txt.reset({ str: txt });
    }

    highlight(color, duration, thickness, disableGrow) {
        this.dis = !!disableGrow;  
        this.hi = true;
        this.h_color = color || [255, 67, 7];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 17;
        this.f = 0;
        this.h_timer = new Timer1(frames(0.67));
        this.s_timer = new FillChanger(this.s, this.h_color);
    }

    dehighlight() {
        this.h_fr = this.f + frames(1);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s.noStroke();
            this.s_timer.advance();
            if (this.f === this.h_fr - frames(0.27)) {
                this.s_timer.fadeOut(0.31);  
            }
            let t = this.h_timer.advance();
            let r = this.r + this.thickness * t;
            if (this.dis) {
                this.s.ellipse(this.x, this.y,
                    this.r + this.thickness * t, this.r + this.thickness * t);
            } else     
                this.s.arc(this.x, this.y, r, r,
                    -this.s.PI + t * this.s.HALF_PI, -this.s.PI + t * this.s.TWO_PI * 1.2499);
        } else
            this.hi = false;
    }

  
    reColor(ringColor, fillColor, txtColor, duration) {
       
        this.c.st.reColor(ringColor, duration);
        this.c.ft.reColor(fillColor ? fillColor : vector_multiply(ringColor, 0.21), duration);
        if (txtColor) {
            this.txt.ft.reColor(txtColor, duration);
        }
    }

    show() {
        if (this.hi)
            this.highlighting();
        this.c.show();
        this.txt.show();
    }
}


class NodeLabel extends Node {
    constructor(ctx, args) {
        super(ctx, args);
        this.txt.reset({   // If it's a two-digit number, text should be shorter.
            x: this.x - 12, y: this.y - 14, size: args.str.length === 2 ? 37 : 42  
        });
        let m = 0.24;
        this.labelColor = args.labelColor || [255, 255, 255];
        this.lin = new Line(this.s, {
            x1: this.x - this.r * m, y1: this.y + this.r * m,
            x2: this.x + this.r * m, y2: this.y - this.r * m,
            strokeweight: 1, start: args.start, color: [255, 255, 255]
        });
        this.label = new TextFade(this.s, {
            str: args.label, mode: 1, x: this.x + 10, y: this.y + 10, start: args.start,
            color: this.labelColor, size: 24
        });
    }

    reColor(ringColor, fillColor, txtColor, labelColor, lineColor, duration) {
        super.reColor(ringColor, fillColor, txtColor, duration);
        if (labelColor)
            this.label.ft.reColor(labelColor, duration);
        if (lineColor)
            this.lin.st.reColor(lineColor, duration);
    }

    reset(cost, down) {  // show reset animations, second parameter specifies direction (default shift up)
        this.resetted = true;
        this.f = 0;
        this.duration = 1;
        this.labelN = new TextFade(this.s, {
            str: "" + cost, mode: 1, x: this.x + 10,
            y: down ? this.y - 20 : this.y + 40, start: this.s.frameCount + 1,
            color: this.labelColor, size: 24
        });
        this.label.ft.fadeOut(0.7);
        let d = down ? 1 : -1;
        this.label.shift(0, 30 * d, 1, 1);
        this.labelN.shift(0, 30 * d, 1, 1);
    }

    resetting() {
        if (this.f <= this.duration * fr) {
            this.f++;
            this.labelN.show();
        } else {
            this.resetted = false;
            this.label = this.labelN;
            this.labelN = null;
        }
    }

    show() {
        super.show();
        this.lin.show();
        if (this.resetted)
            this.resetting();
        this.label.show();
    }
}


class Edge extends Line {
    constructor(ctx, args) {
        super(ctx, args);
        this.size = args.size || 20;
        this.node_r = args.node_r || 60;
        this.color = args.color || ['red'];
        this.txtColor = args.txtColor || [150, 220, 200];
        this.stroke = args.stroke || [17, 47, 127];
        this.directed = args.directed;
        if (this.directed)
            this.tipLen = 12;

        let dx = args.x2 - args.x1;
        let dy = args.y2 - args.y1;
        let xm = this.x1 + dx / 2, ym = this.y1 + dy / 2;
        let len = Math.sqrt(dx * dx + dy * dy);

        if (args.d) {  // need an arc
            this.d = args.d;

            // compute the arc's center, which will also be the location of the text
            this.x3 = (xm - dy * this.d / len)*0.8;
            this.y3 = (ym + dx * this.d / len) * 0.8;

            // compute the arc's centroid
            
            let p1 = this.getPB(this.x1, this.y1, this.x3, this.y3);
            let p2 = this.getPB(this.x2, this.y2, this.x3, this.y3);
            let a1 = p1[0], b1 = p1[1], c1 = p1[2], a2 = p2[0], b2 = p2[1], c2 = p2[2];
            let det = a1 * b2 - b1 * a2;
            this.xc = (c1 * b2 - b1 * c2) / det;  
            this.yc = (a1 * c2 - c1 * a2) / det;

            // this helps to calculate the radius of the node
            let x1d = this.x1 - this.xc, y1d = this.y1 - this.yc;
            this.r = Math.sqrt(x1d * x1d + y1d * y1d);

           
            this.a1 = Math.atan2(y1d, x1d); 
            let x2d = this.x2 - this.xc, y2d = this.y2 - this.yc;
            this.a2 = Math.atan2(y2d, x2d);
            if (this.a2 < this.a1 && this.d < 0) {
                this.a2 += this.s.TWO_PI;
            } else if (this.a2 > this.a1 && this.d > 0) {   
                this.a1 += this.s.TWO_PI;
            }

           
            let half_a = Math.asin(this.node_r / 2 / this.r) * 1.14;  
            if (this.d > 0) {
                this.la1 = this.a1 - half_a;  
                this.la2 = this.a2 + half_a;  
            } else {  
                this.la1 = this.a1 + half_a;
                this.la2 = this.a2 - half_a;
            }

            this.l = this.createLine();

            this.numPts = 27;  
            this.pts = [];
            let a = this.a1;
            let da = (this.a2 - this.a1) / (this.numPts - 1);
            for (let i = 0; i < this.numPts; i++) {
                let x = this.xc + this.r * Math.cos(a), y = this.yc + this.r * Math.sin(a);
                a += da;
                this.pts[i] = [x, y];
            }
        } else {
            // the coordinates of a line segment; it is less than the distance between node centers
            this.lx1 = args.x1 + dx * this.node_r / len * 0.53;
            
            this.lx2 = args.x2 - dx * this.node_r / len * 0.58;
            this.ly1 = args.y1 + dy * this.node_r / len * 0.55;
            this.ly2 = args.y2 - dy * this.node_r / len * 0.56;

            this.l = this.createLine();
            this.x3 = args.x3 || xm;
            this.y3 = args.y3 || ym;
        }
        
        if (args.weight !== undefined) {
            this.str = "" + args.weight;
            this.txt = new TextFade(this.s, {
                str: this.str, x: this.x3, y: this.y3, mode: 1,
                start: args.start, color: this.txtColor,
                stroke: [0, 0, 0],   
                strokeweight: 7, size: this.size
            });
        }
    }

    
    getPB(x1, y1, x2, y2) {
        let a = x1 - x2;
        let b = y1 - y2;
        let xm = x1 - a / 2, ym = y1 - b / 2;  // midpoint of the edge
        return [a, b, a * xm + b * ym];
    }

    createLine(){
        return this.r ? (this.directed ? new ArcArrow(this.s, {   
            r: this.r, x: this.xc, y: this.yc, a1: this.la1, a2: this.la2,
            start: this.start, duration: this.duration, color: this.color, tipLen: this.tipLen
        }) : new Arc(this.s, {  
            r: this.r, x: this.xc, y: this.yc, a1: this.la1, a2: this.la2,
            start: this.start, duration: this.duration, color: this.color,
        })) : (this.directed ? new Arrow(this.s, { 
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
            tipAngle: 0.37, tipLen: this.tipLen,
        }) : new Line(this.s, {  
            x1: this.lx1, x2: this.lx2, y1: this.ly1, y2: this.ly2, start: this.start,
            duration: this.duration, color: this.color,
        }));
    }

    addEdge(color) {  
        this.color = color;
        this.start = this.s.frameCount + 1;
        this.l2 = this.createLine();
    }

    shake(amp) {  // this shake the edge value for animation effect
        this.txt.shake(amp, 0.2);
    }

    reset(str) {
        if (this.txt)
            this.txt.reset({ str: "" + str });
    }

    reColor(lineColor, txtColor, duration) {
        this.l.st.reColor(lineColor, duration);
        if (this.txt !== undefined)
            this.txt.reColor(txtColor, duration);
    }

    highlight(color, duration, thickness) {
        this.hi = true;
        this.h_color = color || [5, 5, 120];
        this.h_dur = duration || 1;
        this.h_fr = frames(this.h_dur);
        this.thickness = thickness || 14;
        this.f = 0;
        this.h_timer = new Timer2(frames(0.67));
        this.s_timer = new StrokeChanger(this.s, this.h_color);
    }

    
    dehighlight() {
        this.h_fr = this.f + frames(1);
    }

    highlighting() {
        if (this.f < this.h_fr) {
            this.f++;
            this.s_timer.advance();
            this.s.strokeWeight(this.thickness);
            if (this.f === this.h_fr - frames(0.27)) {
                this.s_timer.fadeOut(0.22);  // fading out 22 seconds before the term expires
            }
            let t = this.h_timer.advance();
            if (!this.d)
                this.s.line(this.x1, this.y1,
                    this.x1 + t * (this.x2 - this.x1), this.y1 + t * (this.y2 - this.y1));
            else {
                this.s.noFill();
                this.s.beginShape();
                for (let i = 0; i < this.numPts * t - 1; i++) {
                    this.s.vertex(this.pts[i][0], this.pts[i][1]);
                }
                this.s.endShape();
            }
        } else
            this.hi = false;
    }

    show() {
        if (this.hi)
            this.highlighting();
        this.l.show();
        if (this.l2)
            this.l2.show();
        if (this.txt)
            this.txt.show();
    }
}


class Graph_U extends grph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.m; i++) {
            let a = this.E[i][0], b = this.E[i][1];  // this connects two nodes
            let d = this.E[i][2], c = this.E[i][3]; 
            if (c !== undefined)
                this.A[a][b] = this.A[b][a] = c;
            else
                this.A[a][b] = this.A[b][a] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: false, weight: c,
            });

    
            this.edges[b][a] = new Edge(this.s, {
                x1: this.V[b][0], y1: this.V[b][1],
                x2: this.V[a][0], y2: this.V[a][1], color: args.color_e,
                start: this.start + frames(this.dur) + 1, d: -d, 
                duration: 0.8, node_r: this.radius, directed: false, label: false
            });
        }
    }
}


class Graph_D extends grph {
    constructor(ctx, args) {
        super(ctx, args);
        for (let i = 0; i < this.m; i++) {
            let a = this.E[i][0], b = this.E[i][1];  //  this connect two nodes 
            let d = this.E[i][2], c = this.E[i][3];  
            if (c !== undefined)
                this.A[a][b] = c;
            else
                this.A[a][b] = true;

            this.edges[a][b] = new Edge(this.s, {
                x1: this.V[a][0], y1: this.V[a][1],
                x2: this.V[b][0], y2: this.V[b][1],
                start: this.start + frames(this.dur) * i / this.m, d: d, color: args.color_e,
                duration: 0.8, node_r: this.radius, directed: true, weight: c,
            });
        }
    }
}


class Tracer extends PointBase {
    constructor(ctx, args) {
        super(ctx, args);
        this.t = [];
        this.n = 1;
        this.xs = [];
        this.ys = [];
        this.to = 17;  

        this.t[0] = new TextWriteIn(this.s, {
            str: args.str, color: Yellow,
            x: args.x, y: args.y, size: args.size || 29, start: this.start,
        });
        this.start += args.str.length + this.to * 2;

        this.arr = new Arrow(this.s, {
            x1: 0, x2: 0, y1: 1, y2: 1, start: args.begin, color: args.arrColor || Orange,
        });
    }

    add(str, index, x, y, size, color, frameOff) {
        this.t[this.n] = new TextWriteIn(this.s, {
            str: str, x: this.x + x, y: this.y + y, size: size || 29, start: this.start,
            color: color || White
        });
        this.start += str.length + (frameOff ? frameOff : this.to);  
        this.n++;
        if (index >= 0) {
            this.xs[index] = this.x + x;
            this.ys[index] = this.y + y;
        }
    }

    reset(index) {
        this.arr.reset({
            x1: this.xs[index] - 50, x2: this.xs[index] - 10,
            y1: this.ys[index] + 17, y2: this.ys[index] + 17,
        });
    }
    show() {
        for (let t of this.t) t.show();
        this.arr.show();
    }
}


function randomizeWeights(arr, max) {  
    for (let i = 0; i < arr.length; i++) {
        arr[i][3] = Math.floor(Math.random() * max);  
    }
}


function randomizeEdges(arr, prob) {
    let r = [];
    let l = 0;
    for (let i = 0; i < arr.length; i++)
        if (Math.random() < prob) {
            r[l] = arr[i];
            l++;
        }
    return r;
}