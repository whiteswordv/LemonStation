import { localhost } from "./app";
import { Motor } from "./motorTileMenu";

const navContainer = document.getElementById("nav-container");
const tabContainer = document.getElementById("tab-container");
const addTabButton = document.getElementById("add-button");

const warningContainer = document.getElementById("warning-container");

addTabButton?.addEventListener("click", () => {

});

function createTab() {


}

setInterval(() => {

    // checking if its connected
    fetch(`${localhost}/tableConnected`)
        .then(res => res.json())
        .then(data => {
            const connected: boolean = data;



        });

}, 200);