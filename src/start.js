import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import Loggedin from "./Loggedin";

console.log("hi!");

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    // elem = <img src="guinea.jpg"></img>; //change this later so they see more
    elem = <Loggedin />;
}
ReactDOM.render(elem, document.querySelector("main"));
