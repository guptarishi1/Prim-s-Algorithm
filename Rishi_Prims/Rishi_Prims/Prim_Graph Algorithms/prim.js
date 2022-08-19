

let G = {
    V: [[250, 100],  // 0
        [150, 200],  // 1
        [250, 300],  // 2
        [350, 200],  // 3
        [150, 400],  // 4
        [350, 400],  // 5
        [250, 500],  // 6
        [450, 100],  // 7
        [550, 200],  // 8
        [550, 400],  // 9
        [450, 500], 
        [450, 600], // 10
    ],
    E: [[0, 1, 0, 2],
        [0, 2, 0, 4],
        [0, 3, 0, 5],
        [0, 7, 0, 6],
        [1, 2, 0, 8],
        [1, 4, 0, 9],
        [2, 3, 0, 19],
        [2, 5, 0, 10],
        [3, 5, 0, 11],
        [3, 8, 0, 21],
        [3, 9, 0, 10],
        [4, 5, 0, 7],
        [5, 6, 0, 19],
        [5, 9, 0, 11],
        [6, 10, 0, 6],
        [7, 8, 0, 21],
        [8, 9, 0, 15],
        [9, 10, 0, 10],
        [9, 11, 0, 11],
        [10, 11, 0, 18],
        [6, 11, 0, 6],

    ]
};


class Graph_Prim extends Graph_effect {
    constructor(ctx, args) {
        super(ctx, args);
        this.state = 0;  // 0 for searching edges, 1 for adding vertex/edge
        this.added = 0;  // the vertex (starts at 0)
        this.curEdge = [-1, -1];  // the edge that's newly added

        this.VColor = [255, 248, 27];

        // whether a vertex is inside the tree, used when tracing the algorithm
        this.T = [1];  // starts from 0th vertex
        for (let i = 1; i < this.n; i++) {
            this.T[i] = 0;  // 0 for not in, 1 for in
        }

        this.txt = [];
        this.txt[0] = new TextWriteIn(this.s, {
            str: "Prim's Algorithm to find Minimum Spanning Tree", color: Yellow,
            x: 607-400, y: 77+600, size: 0, start: args.time[0],
        });
        this.txt[1] = new TextWriteIn(this.s, {
            str: "Add start node 0 to the tree",
            x: 647-400, y: 127+600, size: 20, start: args.time[0],
        });
        this.txt[2] = new TextWriteIn(this.s, {
            str: "Repeat: ",
            x: 647-400, y: 177+600, size: 20, start: args.time[0],
        });
        this.txt[3] = new TextWriteIn(this.s, {
            str: "1. Check all edges from nodes in tree\n" +
                "    to nodes outside the tree",
            x: 687-400, y: 227+600, size: 20, start: args.time[0],
        });
        this.txt[4] = new TextWriteIn(this.s, {
            str: "2. Find the smallest among such edges",
            x: 687-400, y: 317+600, size: 20, start: args.time[0],
        });
        this.txt[5] = new TextWriteIn(this.s, {
            str: "3. Add this edge and its endpoint to tree",
            x: 687-400, y: 367+600, size: 20, start: args.time[0],
        });
        this.txt[6] = new TextWriteIn(this.s, {
            str: "End",
            x: 647-400, y: 417+600, size: 20, start: args.time[0],
        });
        this.arr = new Arrow(this.s, {
            x1: 597, y1: 140, x2: 597, y2: 140, tipLen:0, color: [255,255,255], start: 0,
        });
    }
    show() {
        super.show();
        for (let t of this.txt) t.show();
        this.arr.show();
        let s = this.s;
        if (! this.finished && s.frameCount % this.f === 0 && s.frameCount > this.begin) {
            if (this.state === 0) {
                this.nodes[this.added].reColor(this.VColor);

                this.state = 1;  
            } else if (this.state === 1) {  // finds the smallest edge
                let weight = 1000000;
                this.curEdge = [-1, -1];
                this.arr.reset({
                    x1: 637, y1: 240, x2: 677, y2: 240
                });
                for (let i = 0; i < this.n; i++) {
                    for (let j = i + 1; j < this.n; j++) {  // The graph is undirected and begins at I + 1.

                        if (this.A[i][j] > -1 && this.T[i] + this.T[j] === 1) {
                            if (this.T[i])  //The spotlight moves from a vertex in T to a vertex that is not in T.
                                this.edges[i][j].highlight();
                            else
                                this.edges[j][i].highlight();
                            if (this.A[i][j] < weight) {
                                weight = this.A[i][j];
                                this.curEdge = [i, j];
                                this.added = this.T[i] ? j : i;
                            }
                        }
                    }
                }
               
                this.A[this.curEdge[0]][this.curEdge[1]] = -1;
                this.T[this.added] = 1;

                this.state = 2;
            } else if (this.state === 2) {  // this help to picks the smallest edge
                this.edges[this.curEdge[0]][this.curEdge[1]].shake(12);
                this.arr.reset({
                    x1: 637, y1: 330, x2: 677, y2: 330
                });

                this.state = 3;
            } 
            else {  // this adds edge and nodes
                this.edges[this.curEdge[0]][this.curEdge[1]].addEdge(Green);

                this.nodes[this.added].reColor(this.VColor);
                this.arr.reset({
                    x1: 637, y1: 380, x2: 677, y2: 380
                });

                this.state = 1;
                this.finished = true;
                for (let n = 0; n < this.n; n++)
                    if (! this.T[n])
                        this.finished = false;
            }
        }
        if (this.finished && s.frameCount % this.f === 29) {
            this.arr.reset({ x1: 597, y1: 430, x2: 637, y2: 430 });
        }
    }
}

const Graph02 = function(s) {
    let t = {
        start: frames(1),
        trace: frames(2),
        txt: [frames(5), frames(8), frames(10), frames(12), frames(15), frames(17), frames(19)],
    };
    let tnr;
    s.preload = function() {
        tnr = s.loadFont('../lib/font/comic.ttf');  
    };
    s.setup = function () {
        setup2D(s);
        s.g = new Graph_Prim(s, {
            V: G.V, E: G.E, font: tnr, start: t.start, begin: t.trace, time: t.txt
        });
        
    };
    s.draw = function () {
        s.background(255,255, 255);
        s.g.show();
        
    };
};

let p = new p5(Graph02);