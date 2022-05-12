import { VectorContainer } from "./vectorContainer";

export class Rectangle<T extends VectorContainer> {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    contains(point: T): boolean {
        return (
            point.vector.x >= this.x &&
            point.vector.x < this.x + this.width &&
            point.vector.y >= this.y &&
            point.vector.y < this.y + this.height
        );
    }

    intersects(other: Rectangle<T>): boolean {
        return !(
            other.x - other.width > this.x + this.width ||
            other.x + other.width < this.x - this.width ||
            other.y - other.height > this.y + this.height ||
            other.y + other.height < this.y - this.height
        );
    }

    toString() {
        return `x: ${this.x}, y: ${this.y}, w: ${this.width}, h: ${this.height}`;
    }
}
