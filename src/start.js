import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import App from "./App";

console.log("hi!");

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    // elem = <img src="guinea.jpg"></img>; //change this later so they see more
    elem = <App />;
}
ReactDOM.render(elem, document.querySelector("main"));
