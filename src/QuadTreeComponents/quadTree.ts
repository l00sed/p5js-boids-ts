import p5 from "p5";

import { Rectangle } from "./rectangle";
import { Drawable } from "../drawable";
import { VectorContainer } from "./vectorContainer";

export class QuadTree<T extends VectorContainer> implements Drawable {
    private points: T[] = [];
    private divided = false;
    private northwest: QuadTree<T>;
    private northeast: QuadTree<T>;
    private southwest: QuadTree<T>;
    private southeast: QuadTree<T>;

    constructor(
        private p: p5,
        private boundary: Rectangle<T>,
        private capacity: number
    ) {}

    insert(point: T): boolean {
        let notInBoundary = !this.boundary.contains(point);
        if (notInBoundary) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (!this.northwest.insert(point)) {
                if (!this.northeast.insert(point)) {
                    if (!this.southeast.insert(point)) {
                        if (!this.southwest.insert(point)) {
                            console.error(
                                `cannot insert x:${point.vector.x} y:${point.vector.y}`
                            );
                        }
                    }
                }
            }

            return true;
        }
    }

    private subdivide() {
        let nw = new Rectangle<T>(
            this.boundary.x,
            this.boundary.y,
            this.boundary.width / 2,
            this.boundary.height / 2
        );
        this.northwest = new QuadTree<T>(this.p, nw, this.capacity);

        let ne = new Rectangle<T>(
            this.boundary.x + this.boundary.width / 2,
            this.boundary.y,
            this.boundary.width / 2,
            this.boundary.height / 2
        );
        this.northeast = new QuadTree<T>(this.p, ne, this.capacity);

        let sw = new Rectangle<T>(
            this.boundary.x,
            this.boundary.y + this.boundary.height / 2,
            this.boundary.width / 2,
            this.boundary.height / 2
        );
        this.southwest = new QuadTree<T>(this.p, sw, this.capacity);

        let se = new Rectangle<T>(
            this.boundary.x + this.boundary.width / 2,
            this.boundary.y + this.boundary.height / 2,
            this.boundary.width / 2,
            this.boundary.height / 2
        );
        this.southeast = new QuadTree<T>(this.p, se, this.capacity);

        this.divided = true;
    }

    query(range: Rectangle<T>, arr: T[] = []): T[] {
        if (!this.boundary.intersects(range)) {
            return arr;
        } else {
            this.points.forEach((point) => {
                if (range.contains(point)) {
                    arr.push(point);
                }
            });

            if (this.divided) {
                this.northwest.query(range, arr);
                this.northeast.query(range, arr);
                this.southwest.query(range, arr);
                this.southeast.query(range, arr);
            }

            return arr;
        }
    }

    draw() {
        this.p.stroke(255, 0, 0, 10);
        this.p.noFill();
        this.p.rect(
            this.boundary.x,
            this.boundary.y,
            this.boundary.width,
            this.boundary.height
        );

        this.points.forEach((point) =>
            this.p.point(point.vector.x, point.vector.y)
        );

        if (this.divided) {
            this.northeast.draw();
            this.northwest.draw();
            this.southeast.draw();
            this.southwest.draw();
        }
    }

    getPoints(): T[] {
        return this.points
            .concat(this.northeast ? this.northeast.getPoints() : [])
            .concat(this.northwest ? this.northwest.getPoints() : [])
            .concat(this.southeast ? this.southeast.getPoints() : [])
            .concat(this.southwest ? this.southwest.getPoints() : []);
    }
}
