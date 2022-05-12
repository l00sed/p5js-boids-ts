import p5, { Color } from "p5";
import { Updatable } from "./updatable";

export class Environment implements Updatable {
    private numberBoidsSlider: p5.Element;
    private numberBoidsLabel: p5.Element;

    private alignSlider: p5.Element;
    private alignLabel: p5.Element;

    private cohesionSlider: p5.Element;
    private cohesionLabel: p5.Element;

    private separationSlider: p5.Element;
    private separationLabel: p5.Element;

    private perceptionSlider: p5.Element;
    private perceptionLabel: p5.Element;

    private maxSpeedSlider: p5.Element;
    private maxSpeedLabel: p5.Element;

    private maxForceSlider: p5.Element;
    private maxForceLabel: p5.Element;

    private quadTreeCapSlider: p5.Element;
    private quadTreeCapLabel: p5.Element;

    private frameRateP: p5.Element;
    private frameRates: number[] = [];

    constructor(private p: p5) {
        this.frameRateP = p.createP("Framerates: calculating...");
        this.frameRateP.class("framerate");

        let controls = p.createDiv();
        controls.class("controls");

        let numberBoidsGroup = p.createDiv();
        numberBoidsGroup.class("control-group");
        controls.child(numberBoidsGroup);

        let alignGroup = p.createDiv();
        alignGroup.class("control-group");
        controls.child(alignGroup);

        let cohesionGroup = p.createDiv();
        cohesionGroup.class("control-group");
        controls.child(cohesionGroup);

        let separationGroup = p.createDiv();
        separationGroup.class("control-group");
        controls.child(separationGroup);

        let perceptionGroup = p.createDiv();
        perceptionGroup.class("control-group");
        controls.child(perceptionGroup);

        let maxSpeedGroup = p.createDiv();
        maxSpeedGroup.class("control-group");
        controls.child(maxSpeedGroup);

        let maxForceGroup = p.createDiv();
        maxForceGroup.class("control-group");
        controls.child(maxForceGroup);

        let quadTreeCapGroup = p.createDiv();
        quadTreeCapGroup.class("control-group");
        controls.child(quadTreeCapGroup);

        numberBoidsGroup.child(p.createP("Number of Boids"));
        this.numberBoidsSlider = p.createSlider(10, 500, 100, 10);
        numberBoidsGroup.child(this.numberBoidsSlider);
        this.numberBoidsLabel = p.createP("100");
        numberBoidsGroup.child(this.numberBoidsLabel);

        alignGroup.child(p.createP("Alignment"));
        this.alignSlider = p.createSlider(0, 5, 1, 0.1);
        alignGroup.child(this.alignSlider);
        this.alignLabel = p.createP("100%");
        alignGroup.child(this.alignLabel);

        cohesionGroup.child(p.createP("Cohesion"));
        this.cohesionSlider = p.createSlider(0, 5, 1, 0.1);
        cohesionGroup.child(this.cohesionSlider);
        this.cohesionLabel = p.createP("100%");
        cohesionGroup.child(this.cohesionLabel);

        separationGroup.child(p.createP("Separation"));
        this.separationSlider = p.createSlider(0, 5, 1, 0.1);
        separationGroup.child(this.separationSlider);
        this.separationLabel = p.createP("100%");
        separationGroup.child(this.separationLabel);

        perceptionGroup.child(p.createP("Perception"));
        this.perceptionSlider = p.createSlider(0, 5, 1, 0.1);
        perceptionGroup.child(this.perceptionSlider);
        this.perceptionLabel = p.createP("100%");
        perceptionGroup.child(this.perceptionLabel);

        maxSpeedGroup.child(p.createP("Max Speed"));
        this.maxSpeedSlider = p.createSlider(0, 5, 1, 0.1);
        maxSpeedGroup.child(this.maxSpeedSlider);
        this.maxSpeedLabel = p.createP("100%");
        maxSpeedGroup.child(this.maxSpeedLabel);

        maxForceGroup.child(p.createP("Max Force"));
        this.maxForceSlider = p.createSlider(0, 5, 1, 0.1);
        maxForceGroup.child(this.maxForceSlider);
        this.maxForceLabel = p.createP("100%");
        maxForceGroup.child(this.maxForceLabel);

        quadTreeCapGroup.child(p.createP("Tree Division"));
        this.quadTreeCapSlider = p.createSlider(1, 100, 1, 1);
        quadTreeCapGroup.child(this.quadTreeCapSlider);
        this.quadTreeCapLabel = p.createP("4");
        quadTreeCapGroup.child(this.quadTreeCapLabel);
    }

    update(): void {
        this.frameRates.push(this.p.frameRate());

        if (this.frameRates.length % 60 === 0) {
            this.frameRateP.html(
                `Framerates: min ${this.p.ceil(
                    this.p.min(this.frameRates)
                )}, max ${this.p.ceil(
                    this.p.max(this.frameRates)
                )}, avg ${this.p.ceil(
                    this.frameRates.reduce((a, b) => a + b) /
                        this.frameRates.length
                )}`
            );

            this.frameRates = [];
        }
    }

    get numberBoidsScale(): number {
        let value = +this.numberBoidsSlider.value();
        this.numberBoidsLabel.html(`${this.p.round(value)}`);
        return value;
    }

    get alignScale(): number {
        let value = +this.alignSlider.value();
        this.alignLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get cohesionScale(): number {
        let value = +this.cohesionSlider.value();
        this.cohesionLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get separationScale(): number {
        let value = +this.separationSlider.value();
        this.separationLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get perceptionScale(): number {
        let value = +this.perceptionSlider.value();
        this.perceptionLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get maxSpeedScale(): number {
        let value = +this.maxSpeedSlider.value();
        this.maxSpeedLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get maxForceScale(): number {
        let value = +this.maxForceSlider.value();
        this.maxForceLabel.html(`${this.p.round(value * 100)}%`);
        return value;
    }

    get quadTreeCap(): number {
        let value = +this.quadTreeCapSlider.value();
        this.quadTreeCapLabel.html(value.toString());
        return value;
    }
}
