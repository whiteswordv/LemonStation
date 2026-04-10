const tileGrid = document.getElementById("motor-grid");
const motorMenu = document.getElementById("motor-menu");
const speedOutput = document.getElementById("motor-speed-output");

const dropDownContainer = document.getElementById("drop-down-container");
const warningContainer = document.getElementById("warning-container");
const pidContainer = document.getElementById("pid-container");

// tile creation ----------------------------------------------------

motorMenu.classList.add("hidden");
warningContainer.classList.add("hidden");

function createTile(motor) {

  if (getDisplay(motor) == "Unknown")
    return;

  const tile = document.createElement("div");
  tile.classList.add("motor-tile");

  const name = document.createElement("h1");
  name.innerHTML = getDisplay(motor);

  const id = document.createElement("h2");
  id.innerHTML = "CAN ID " + motor.id;

  const img = document.createElement("img");
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

  if (motor.type != "sparkmax")
    dropDownContainer?.classList.add("hidden");
  else
    dropDownContainer?.classList.remove("hidden");


  // title

  const nameHeader = document.getElementById("motor-name");
  nameHeader.innerHTML = getDisplay(motor);

  const idHeader = document.getElementById("motor-id");
  idHeader.innerHTML = "CAN id " + motor.id;

  //properties

  const back = document.getElementById("back-button");
  const invertButton = document.getElementById("inverted-input");
  const disableButton = document.getElementById("disabled-input");
  const speedSlider = document.getElementById("speed-slider");
  const brushlessDropdown = document.getElementById("motor-dropdown-type");

  const pInput = pidContainer.querySelector("#p-input");
  const iInput = pidContainer.querySelector("#i-input");
  const dInput = pidContainer.querySelector("#d-input");

  // const applyPidButton = pidContainer.getElementById("apply-button"); 
  // applyPidButton.onclick = () => setPidControl(motor, pInput.value, iInput.value, dInput.value, disableButton.checked);

  speedSlider.value = motor.speed;
  invertButton.checked = motor.inverted;
  brushlessDropdown.value = motor.brushless;



  // dash board

  const motorImage = document.getElementById("motor-img");
  motorImage.setAttribute("src", getImage(motor));

  const faults = document.getElementById("faults");
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

    tileGrid.classList.remove("hidden");
    motorMenu.classList.add("hidden");
  };
}

function setMotorSpeed(motor, speed, inverted, disabled) {
  console.log(true);

  let invertedValue = inverted ? -1 : 1;
  invertedValue *= disabled ? 0 : 1;

  if (disabled) {
    fetch(`/speed/${motor.id}?v=${0}`, {
      method: "POST",
    });
  }

  // posts the speed over the network
  fetch(`/speed/${motor.id}?v=${speed * invertedValue}`, {
    method: "POST",
  });

  speedOutput.innerHTML = "Speed: " + speed * invertedValue;
}

function setPidControl(motor, kp, ki, kd, disabled) {
  if (disabled) {

    fetch(`/pid/${motor.id}?v=${[0, 0, 0]}`, {
      method: "POST",
    });

    return;
  }

  fetch(`/pid/${motor.id}?v=${[kp, ki, kd]}`, {
    method: "POST",
  });
}

// tile removment -------------------------------------------------

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

// motor logic --------------------------------------------------------

let oldMotors = [];
let motors = [/* data goes here */];

function includesMotor(array, motor) {
  return array.some((m) => m.id == motor.id && m.type == motor.type);
}

setInterval(() => {

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

  // REMOVE this for testing!
  // removes any old motors in the list
  oldMotors.forEach((oldMotor) => {

    if (!includesMotor(motors, oldMotor)) removeTile(oldMotor || oldMotor.type == "unknown");
  });

  oldMotors = [...motors];

}, 500);
