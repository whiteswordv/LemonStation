const tileGrid = document.getElementById("motor-grid"); 

function createTile(motor) {

    let tile = document.createElement("div");
    tile.classList.add("motor-tile");

    let name = document.createElement("h1");
    name.innerHTML = getDisplay(motor); 

    let id = document.createElement("h2");
    id.innerHTML = "CAN ID " + motor.id; 

    let img = document.createElement("img");
    img.setAttribute("src", getImage(motor)); 


    tile.append(name); 
    tile.append(id); 
    tile.append(img); 

    tile.addEventListener("click", () => {
        settings(motor); 
    });

    tileGrid.append(tile); 
}

function removeTile(motor) {
    
    [...tileGrid.querySelectorAll(".motor-tile",)].forEach(tile => {
        if (tile.querySelector("h2").innerHTML == "CAN ID " + motor.id) {
            tile.remove(); 
        }
    });

}

function getDisplay(motor) {
    switch (motor.type) {
        case "sparkmax":
            return "SPARK MAX"
        case "krakenx60":
            return "Kraken X60"
        case "krakenx44":
            return "Kraken X44"
        case "falcon500":
            return "Falcon 500"
        default:
            return "Unknown"
    }
}

function getImage(motor) {
    switch (motor.type) {
        case "sparkmax":
            return "imgs/placeHolder.png"
        case "krakenx60":
            return "imgs/placeHolder.png"
        case "krakenx44":
            return "imgs/placeHolder.png"
        case "falcon500":
            return "imgs/placeHolder.png"
        default:
            return "imgs/placeHolder.png"
    }
}

function settings(motor) {
    
}

let oldMotors = [];
let motors = [
        {
            id: 0,
            type: "sparkmax"
        }, 

        {
            id: 1,
            type: "krakenx60"
        }
    ];

function includesMotor(array, motor) {
    return array.some(m => m.id == motor.id && m.type == motor.type)
}

function updateMotors() {
    motors.forEach(motor => {
        if (includesMotor(oldMotors, motor)) return;

        createTile(motor); 
    });

    oldMotors.forEach(oldMotor => {

        if (!includesMotor(motors, oldMotor))
            removeTile(oldMotor);

    }); 

    oldMotors = [...motors];
}

updateMotors();

setInterval(updateMotors, 200);