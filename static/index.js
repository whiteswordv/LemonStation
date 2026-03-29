const tileGrid = document.getElementById("motor-grid");
const motorMenu = document.getElementById("motor-menu");
const speedOutput = document.getElementById("motor-speed-output");
const dropDownContainer = document.getElementById("drop-down-container");
const warningContainer = document.getElementById("warning-container");

// tile creation ----------------------------------------------------

motorMenu.classList.add("hidden");
warningContainer.classList.add("hidden");

function createTile(motor) {

  if (getDisplay(motor) == "Unknown")
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

  tile.onclick = () => {
    settings(motor);
  }

  tileGrid.append(tile);
}

// setting ----------------------------------------

function settings(motor) {
  motorMenu.classList.remove("hidden");
  tileGrid.classList.add("hidden");

  fetch(`/focused/${motor.id}?v=${true}`, {
    method: "POST",
  });

  if (motor.type != "sparkmax")
    dropDownContainer?.classList.add("hidden");
  else
    dropDownContainer?.classList.remove("hidden");


  // title

  let nameHeader = document.getElementById("motor-name");
  nameHeader.innerHTML = getDisplay(motor);

  let idHeader = document.getElementById("motor-id");
  idHeader.innerHTML = "CAN id " + motor.id;

  //properties

  let back = document.getElementById("back-button");
  let invertButton = document.getElementById("inverted-input");
  let disableButton = document.getElementById("disabled-input");
  let speedSlider = document.getElementById("speed-slider");
  let brushlessDropdown = document.getElementById("motor-dropdown-type");

  speedSlider.value = motor.speed;
  invertButton.checked = motor.inverted;
  brushlessDropdown.value = motor.brushless;

  // dash board

  let motorImage = document.getElementById("motor-img");
  motorImage.setAttribute("src", getImage(motor));

  let faults = document.getElementById("faults");
  faults.innerHTML = motor.faults;

  speedSlider.onchange = () => setMotorSpeed(motor, speedSlider.value, invertButton.checked);
  invertButton.onclick = () => setMotorSpeed(motor, speedSlider.value, invertButton.checked);

  // this depends on if its a sparkmax
  brushlessDropdown.onchange = () => {
    fetch(`/brushless/${motor.id}?v=${brushlessDropdown.value}`, {
      method: "POST",
    });
  }

  disableButton.onchange = () => setMotorSpeed(motor, 0, invertButton.checked, disableButton.checked);

  back.onclick = () => {

    disableButton.checked = true;

    setMotorSpeed(motor, 0, invertButton.checked, disableButton.checked);

    fetch(`/focused/${motor.id}?v=${false}`, {
      method: "POST",
    });

    tileGrid.classList.remove("hidden");
    motorMenu.classList.add("hidden");
  };
}

function setMotorSpeed(motor, speed, inverted, disabled) {

  if (disabled) {
    fetch(`/speed/${motor.id}?v=${0}`, {
      method: "POST",
    });

    return;
  }

  let invertedValue = 1;

  if (inverted)
    invertedValue = -1;

  speedOutput.innerHTML = "Speed: " + speed * invertedValue;

  fetch(`/speed/${motor.id}?v=${speed * invertedValue}`, {
    method: "POST",
  });
}

// tile removment -------------------------------------------

function removeTile(motor) {
  [...tileGrid.querySelectorAll(".motor-tile")].forEach((tile) => {
    if (tile.querySelector("h2").innerHTML == "CAN ID " + motor.id) {
      tile.remove();
    }
  });
}

// getting properties ----------------------------------------------

function getDisplay(motor) {
  switch (motor.type) {
    case "sparkmax":
      return "SPARK MAX";
    case "talonfx":
      return "TalonFX";
    default:
      return "Unknown";
  }
}

function getImage(motor) {
  switch (motor.type) {
    case "sparkmax":
      return "imgs/sparkmax.png";
    case "talonfx":
      return "imgs/krakenX60.png";
    default:
      return "imgs/placeHolder.png";
  }
}


// motor logic ----------------------------------------------------------

let oldMotors = [];
let motors = [
  {
    "id": 3,
    "brushless": false,
    "type": "sparkmax",
    "speed": 0,
    "faults": "",
    "stickyFaults": "",
    "focused": false
  }
];

function includesMotor(array, motor) {
  return array.some((m) => m.id == motor.id && m.type == motor.type);
}

function updateMotors() {


  fetch("/tableConnected")
    .then((response) => response.json())
    .then((data) => {

      if (!data.connected)
        warningContainer.classList.remove("hidden");
      else
        warningContainer.classList.add("hidden");

    });
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

setInterval(() => {
  // checkNotification()
  updateMotors();
}, 500);
