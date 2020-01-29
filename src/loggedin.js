import React from "react";
// import Login from "./login";
// import { HashRouter, Route } from "react-router-dom";

export default class Loggedin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <div
                    style={{
                        color: "darkblue",
                        fontFamily: "Lobster",
                        fontSize: "70px"
                    }}
                >
                    welcome to my network! you are now logged in.
                </div>
            </div>
        );
    }
}
