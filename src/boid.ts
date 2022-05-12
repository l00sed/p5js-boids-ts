import p5, { Vector } from "p5";

import { Drawable } from "./drawable";
import { Updatable } from "./updatable";
import { Environment } from "./environment";
import { VectorContainer } from "./QuadTreeComponents/vectorContainer";
import { Rectangle } from "./QuadTreeComponents/rectangle";

export class Boid implements Drawable, Updatable, VectorContainer {
    velocity: Vector;
    private position: Vector;
    private acceleration: Vector;
    private perceptionRadius: number = 50;
    private maxForce: number  = 0.2;
    private maxSpeed: number = 4;
    private readonly perceptionRadiusStart: number = 50;
    private readonly maxForceStart: number = 0.2;
    private readonly maxSpeedStart: number = 4;

    constructor(private p: p5, private env: Environment) {
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = Vector.random2D();
        this.velocity.setMag(p.random(2, 4));
        this.acceleration = p.createVector();
    }

    get vector(): p5.Vector {
        return this.position;
    }

    getSearchRectangle(): Rectangle<Boid> {
        return new Rectangle<Boid>(
            this.position.x - this.perceptionRadius,
            this.position.y - this.perceptionRadius,
            this.perceptionRadius * 2,
            this.perceptionRadius * 2
        );
    }

    private edges() {
        if (this.position.x > this.p.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = this.p.width;
        }

        if (this.position.y > this.p.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = this.p.height;
        }
    }

    flock(boids: Boid[]) {
        this.acceleration.mult(0);
        this.perceptionRadius = this.perceptionRadiusStart * this.env.perceptionScale;

        this.maxSpeed = this.maxSpeedStart * this.env.maxSpeedScale;
        this.maxForce = this.maxForceStart * this.env.maxForceScale;

        let total = 0;

        let alignment = this.p.createVector();
        let cohesion = this.p.createVector();
        let separation = this.p.createVector();

        for (const other of boids) {
            let dist = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && dist < this.perceptionRadius) {
                total++;

                //align
                alignment.add(other.velocity);

                //cohesion
                cohesion.add(other.position);

                //separation
                let diff = Vector.sub(this.position, other.position);
                diff.div(dist);
                separation.add(diff);
            }
        }

        if (total) {
            alignment.div(total);
            alignment.setMag(this.maxSpeed);
            alignment.sub(this.velocity);
            alignment.limit(this.maxForce);
            alignment.mult(this.env.alignScale);

            cohesion.div(total);
            cohesion.sub(this.position);
            cohesion.setMag(this.maxSpeed);
            cohesion.sub(this.velocity);
            cohesion.limit(this.maxForce);
            cohesion.mult(this.env.cohesionScale);

            separation.div(total);
            separation.setMag(this.maxSpeed);
            separation.sub(this.velocity);
            separation.limit(this.maxForce);
            separation.mult(this.env.separationScale);
        }

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update(): void {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        this.edges();
    }

    draw(): void {
        this.p.noFill();
        this.p.push();
        this.p.strokeWeight(1);
        this.p.stroke(255,255,255,200);
        this.p.fill(255,255,255,200);
        this.p.translate(this.position.x, this.position.y);
        this.p.rotate(this.velocity.heading() + this.p.HALF_PI);
        this.p.triangle(0, 0, 7, 20, -7, 20);
        this.p.pop();
        this.p.strokeWeight(1);
        this.p.stroke(155,55,255,90);
        this.p.ellipseMode(this.p.CENTER);
        this.p.ellipse(this.position.x, this.position.y, this.perceptionRadius);
    }
}
