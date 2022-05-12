import p5 from "p5";

import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import { Boid } from "./boid";
import { Environment } from "./environment";
import { QuadTree } from "./QuadTreeComponents/quadTree";
import { Rectangle } from "./QuadTreeComponents/rectangle";

export class Sketch implements Drawable, Updatable {
    private initiated: boolean = false;
    private numberBoids: number = 100;
    private updatables: Updatable[] = [];
    private drawables: Drawable[] = [];
    private boids: Boid[] = [];
    private tree: QuadTree<Boid>;
    private env: Environment;

    constructor(private p: p5) {
        p.createCanvas(innerWidth * 0.8, innerHeight * 0.8);
        this.env = new Environment(p);

        this.updatables.push(this.env);
    }

    update() {
        if (this.numberBoids != this.env.numberBoidsScale) {
            // Empty Update Bins
            this.boids      = [];
            this.updatables = [];
            this.drawables  = [];
            // Set to new number of Boids
            this.numberBoids = this.env.numberBoidsScale;
            // Re-initiate simulation
            this.initiated = false;
        }

        if (this.initiated == false) { // If has not been initiated (or initiation reset)
            // Setup boids
            for (let i = 0; i < this.env.numberBoidsScale; i++) {
                var boid = new Boid(this.p, this.env);
                this.boids.push(boid);
                this.updatables.push(boid);
                this.drawables.push(boid);
            }
            // Set initiated to "true"
            this.initiated = true;
        }

        this.tree = new QuadTree<Boid>(
            this.p,
            new Rectangle(0, 0, this.p.width, this.p.height),
            this.env.quadTreeCap
        );

        this.boids.forEach((b) => this.tree.insert(b));

        for (const boid of this.boids) {
            let closeBoids = this.tree.query(boid.getSearchRectangle());
            boid.flock(closeBoids);
        }
        this.updatables.forEach((u) => u.update());
    }

    draw() {
        this.p.background(0,0,0,30);
        this.tree.draw();
        this.drawables.forEach((d) => d.draw());
    }
}
