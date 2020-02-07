import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import App from "./App";

//redux Boiler Plate
import { Provider } from "react-redux";

import { createStore, applyMiddleware } from "redux"; //store IS redux. an object that containt the redux state as well as methods we can use to interact with state.
import reduxPromise from "redux-promise"; //our action creator can return promises thanks to this line.
import { composeWithDevTools } from "redux-devtools-extension"; //allows to use redux devtools
import reducer from "./reducers";

const store = createStore(
    //creates the store, passing it reducer and then everything else.
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

console.log("hi!");

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    // elem = <img src="guinea.jpg"></img>; //change this later so they see more
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
ReactDOM.render(elem, document.querySelector("main"));
