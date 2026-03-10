const tileGrid = document.getElementById("motor-grid");
const warning = document.getElementById("warning");
const motorMenu = document.getElementById("motor-menu");

function createTile(motor) {

  if (motor.type == "unknown")
    return;

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

function settings(motor) {
  motorMenu.classList.remove("hidden");
  tileGrid.classList.add("hidden");

  let id = motor.id;
  let invertedValue = 1;

  let nameHeader = document.getElementById("motor-name");
  nameHeader.innerHTML = getDisplay(motor);

  let idHeader = document.getElementById("motor-id");
  idHeader.innerHTML = "CAN id " + id;

  //properties

  let back = document.getElementById("back-button");
  let invertButton = document.getElementById("inverted-input");

  let speedSlider = document.getElementById("speed-slider");
  speedSlider.value = motor.speed;


  if (getDisplay(motor) == "SPARK MAX") {
    let dropdown = document.createElement("input");
    dropdown.attributes = document.createAttribute("type");
    dropdown.attributes = document.createAttribute("id");

    dropdown.innerHTML = "<a brushed </a> <a brushless </a>";

    dropdown.addEventListener("input", () => {
      fetch(`/brushless/${id}?v=${dropdown.value}`, {
        method: "POST",
      });
    });
  }

  // dash

  let motorImage = document.getElementById("motor-img");
  motorImage.setAttribute("src", getImage(motor));

  let faults = document.getElementById("faults");
  getFaults(motor, faults);

  speedSlider.addEventListener("input", () => {
    let speed = speedSlider.value * invertedValue;

    fetch(`/speed/${id}?v=${speed}`, {
      method: "POST",
    });
  });

  invertButton.addEventListener("click", () => {
    invertedValue *= -1;

    let speed = speedSlider.value * invertedValue;

    fetch(`/speed/${id}?v=${speed}`, {
      method: "POST",
    });
  });

  back.addEventListener("click", () => {
    tileGrid.classList.remove("hidden");
    motorMenu.classList.add("hidden");
  });
}

function getFaults(motor, text) {

  setInterval(() => {

    text.innerText = motor.faults;
  }, 200);
}

function removeTile(motor) {
  [...tileGrid.querySelectorAll(".motor-tile")].forEach((tile) => {
    if (tile.querySelector("h2").innerHTML == "CAN ID " + motor.id) {
      tile.remove();
    }
  });
}

function getDisplay(motor) {
  switch (motor.type) {
    case "sparkmax":
      return "SPARK MAX";
    case "krakenx60":
      return "Kraken X60";
    case "krakenx44":
      return "Kraken X44";
    case "falcon500":
      return "Falcon 500";
    default:
      return "Unknown";
  }
}

function getImage(motor) {
  switch (motor.type) {
    case "sparkmax":
      return "imgs/sparkmax.png";
    case "krakenx60":
      return "imgs/krakenX60.png";
    case "krakenx44":
      return "imgs/krakenX44.png";
    case "falcon500":
      return "imgs/falcon500.png";
    default:
      return "imgs/placeHolder.png";
  }
}

let oldMotors = [];
let motors = [
  {
    id: 0,
    type: "sparkmax",
    speed: 0,
  },
  {
    id: 1,
    type: "krakenx60",
    speed: 0,
  }
];

function includesMotor(array, motor) {
  return array.some((m) => m.id == motor.id && m.type == motor.type);
}

function updateMotors() {
  // getting the data from the flask local host
  fetch("/motors")
    .then((response) => response.json())
    .then((data) => (motors = data));

  // creating the tiles without repeats Uwu
  motors.forEach((motor) => {
    if (includesMotor(oldMotors, motor)) return;

    createTile(motor);
  });

  // oldMotors.forEach((oldMotor) => {
  //   if (!includesMotor(motors, oldMotor)) removeTile(oldMotor || oldMotor.type == "unknown");
  // });

  oldMotors = [...motors];
}

updateMotors();
motorMenu.classList.add("hidden");

setInterval(updateMotors, 200);
