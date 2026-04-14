export const localhost = "http://127.0.0.1:5000";

const navContainer = document.getElementById("nav-container");
const tabContainer = document.getElementById("tab-container");
const addTabButton = document.getElementById("add-button");

const warningContainer = document.getElementById("warning-container");

setInterval(() => {
    // checking if its connected
    fetch(`${localhost}/tableConnected`)
        .then((res) => res.json())
        .then((data) => {
            const connected: boolean = data;
        });
}, 200);