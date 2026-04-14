export const localhost = "http://127.0.0.1:5000";

const warningContainer = document.getElementById("warning-container");
const contentContainer = document.getElementById("content");
const navContainer = document.getElementById("nav-container");
const tabContainer = document.getElementById("tab-container");

const addTabButton = document.getElementById("add-button");

export function createError(message: string) {

    const error = document.createElement("div")

    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;

    error.append(errorMessage);

    const closeButton = document.createElement("button");
    closeButton.innerText = "X";

    closeButton.addEventListener("click", () => error.remove());


    warningContainer?.append(error);
}


setInterval(() => {
    // checking if its connected
    fetch(`${localhost}/tableConnected`)
        .then((res) => res.json())
        .then((data) => {
            const connected: boolean = data;


        });
}, 200);