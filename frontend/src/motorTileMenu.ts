import { localhost } from "./app";
import { loadProperties } from "./motorPropertiesMenu";

const tileGrid: HTMLElement | null = document.getElementById("tile-grid");

// the properties that the motor holds
export type Motor = {
    id: number,
    speed: number,
    amps: number,
    voltage: number,

    inverted: boolean,
    brushless: boolean,
    disabled: boolean,

    type: string,
    faults: string,
    stickyFaults: string,

    tile: HTMLElement,
}

/**
 * creates a tile to the corresponding motor. 
 * @param motor the motor that is detected.
 * @returns Element which is just the tile.
 */
function createTile(motor: Motor): HTMLElement {

    const tile = document.createElement("div");

    const motorName = document.createElement("h1");
    motorName.innerHTML = getMotorTextDisplay(motor);

    const motorId = document.createElement("h2");
    motorId.innerHTML = motor.id.toString();

    const motorImage = document.createElement("img");
    motorImage.src = getMotorImage(motor);

    tile.append(motorName);
    tile.append(motorId);
    tile.append(motorImage);

    tile.addEventListener("click", () => {

        // set html to properties

        // gets values
        loadProperties(motor);
    });

    return tile;
}

/**
 * removes tile to corresponding motor. 
 * @param motor the motor thats being removed. 
 */
function removeTile(motor: Motor): void {
    motor.tile.remove();
}

/**
 * returns the displayed motor type. 
 * @param motor the motor.
 * @returns string
 */
export function getMotorTextDisplay(motor: Motor): any {
    switch (motor.type) {
        case "sparkmax":
            return "SPARK MAX";
        case "talonfx":
            return "TalonFX";
        default:
            return "Unknown";
    }
}

/**
 * returns the image that corresponds to the motor being detected.
 * @param motor the motor.
 * @returns image path. 
 */
export function getMotorImage(motor: Motor): any {
    switch (motor.type) {
        case "sparkmax":
            return "imgs/sparkmax.png";
        case "talonfx":
            return "imgs/krakenX60.png"
        default:
            return "imgs/placeHolder.png";
    }
}

// keeps track of what motors are connected and clears the ones that aren't anymore. 
let oldMotors: Motor[] = [];

setInterval(() => {

    fetch(`${localhost}/motors`)
        .then((res) => res.json())
        .then((motors: Motor[]) => {
            // creates new motor tiles
            motors.forEach((motor: Motor, i: number) => {
                const exists = motors.some((m) => motor.id && m.type == motor.type);

                if (!exists) {
                    motor.tile = createTile(motor);
                    tileGrid?.append(motor.tile);
                }
            });

            //removes old motors

            oldMotors.forEach((motor: Motor) => {
                const exists = oldMotors.some((m) => motor.id && m.type == motor.type);

                if (!exists || motor.type == "unknown")
                    removeTile(motor);

            });

            // makes current ones old 
            oldMotors = [...motors];
        });
}, 200);
