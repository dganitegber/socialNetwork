import React from "react";
import axios from "./axios";
import { HashRouter } from "react-router-dom";
import { Link } from "react-router-dom";

// import Changer from "./changer";
// import "./style.css";

export default class Resgistration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit() {
        console.log(" ic clicked submit");

        axios
            .post("/register", {
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("data: ", data);

                    //it worked
                    console.log("it worked");
                    location.replace("/");
                    console.log("data: ", data);
                } else {
                    //failure!
                    this.setState({
                        error: true
                    });
                    console.log("didn't work");
                }
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
                {this.state.error && (
                    <div className="error">
                        something went wrong, please try again.
                    </div>
                )}
                <input
                    className="firstname registerfield"
                    name="firstname"
                    placeholder="First name"
                    onChange={e => this.handleChange(e)}
                />
                {this.state.firstname === undefined && this.state.error && (
                    <div className="error">Please fill in your first name!</div>
                )}
                <input
                    className="lastname registerfield"
                    name="lastname"
                    placeholder="Last name"
                    onChange={e => this.handleChange(e)}
                />
                {this.state.lastname === undefined && this.state.error && (
                    <div className="error">Please fill in your last name!</div>
                )}
                <input
                    className="email registerfield"
                    name="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                {this.state.email === undefined && this.state.error && (
                    <div className="error">Please fill your Email adress!</div>
                )}
                <input
                    className="password registerfield"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={e => this.handleChange(e)}
                />
                {this.state.password === undefined && this.state.error && (
                    <div className="error">Please select password!</div>
                )}
                <button
                    className="submit-btn-register"
                    onClick={e => this.submit(e)}
                >
                    Register now! <i className="fas fa-users"></i>
                </button>
                <HashRouter class="innerLink">
                    <Link to="/login">Login</Link>
                </HashRouter>
                <HashRouter>
                    <Link to="/forgotpass">Forgot Password</Link>
                </HashRouter>
            </div>
        );
    }
}
