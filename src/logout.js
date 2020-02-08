import React from "react";
import axios from "./axios";
// import { HashRouter } from "react-router-dom";
// import { Link } from "react-router-dom";

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    logout() {
        console.log(" ic clicked logout");

        axios
            .post("/logout")

            .then(({ data }) => {
                console.log(data);
            });
    }
    render() {
        // const name = this.state.name;
        // const firstname = this.state.firstname;
        // const lastname = this.state.lastname;
        // const password = this.state.password;
        // const email = this.state.email;

        console.log("this.state", this.state);
        return (
            <div className="registrationfields">
                <p onClick={e => this.logout(e)}> Log out </p>
            </div>
        );
    }
}
