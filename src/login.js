import React from "react";
import axios from "./axios";
import { HashRouter } from "react-router-dom";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
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
        console.log(" ic clicked login");

        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("data: ", data);

                    //it worked
                    console.log("it worked");
                    location.replace("/welcome");
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
                <input
                    className="email registerfield"
                    name="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    className="password registerfield"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={e => this.handleChange(e)}
                />
                <button
                    className="submit-btn-register"
                    onClick={e => this.submit(e)}
                >
                    Login now! <i className="fas fa-users"></i>
                </button>

                <HashRouter>
                    <Link to="/" className="register">
                        Register
                    </Link>
                </HashRouter>
            </div>
        );
    }
}
