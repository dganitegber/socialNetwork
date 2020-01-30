import React from "react";
import axios from "./axios";
import { HashRouter } from "react-router-dom";
import { Link } from "react-router-dom";

export default class Forgotpass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.stage = 1;
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit() {
        // let stage = this.state.stage;
        console.log(" ic clicked submit");
        axios
            .post("/forgotpass", {
                email: this.state.email
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("data: ", data);

                    //it worked
                    console.log("it worked");
                    this.setState({
                        stage: 2
                    });
                    console.log(" 33data: ", data);
                } else {
                    //failure!
                    this.setState({
                        error: true
                    });
                    console.log("didn't work");
                }
            });
    }
    newpass() {
        console.log(" ic clicked newpass");
        axios
            .post("/newpass", {
                email: this.state.email,
                passcode: this.state.passcode,
                newPass: this.state.newpass,
                newPassRepeat: this.state.newPassRepeat
            })

            .then(({ data }) => {
                if (data.success) {
                    console.log("should go to stage 3 data: ", data);

                    //it worked
                    console.log("it worked");
                    this.setState({
                        stage: 3
                    });
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
        if (this.state.stage === 1) {
            console.log("this.state.stage", this.state.stage);

            return (
                <div className="registrationfields">
                    <input
                        className="email registerfield"
                        name="email"
                        placeholder="Your Email address"
                        onChange={e => this.handleChange(e)}
                    />

                    {this.state.error &&
                        this.state.email ===
                            undefined(
                                <div className="error">
                                    something went wrong, please try again.
                                </div>
                            )}
                    <button
                        className="submit-btn-register"
                        onClick={e => this.submit(e)}
                    >
                        Send code <i className="fas fa-users"></i>
                    </button>

                    <HashRouter>
                        <Link to="/" className="register">
                            Register
                        </Link>
                        <Link to="/login" className="register">
                            Log in
                        </Link>
                    </HashRouter>
                </div>
            );
        }
        if (this.state.stage === 2) {
            return (
                <div className="registrationfields">
                    <input
                        className="email registerfield"
                        name="email1"
                        placeholder="Your Email address"
                        onChange={e => this.handleChange(e)}
                    />
                    <input
                        className="passcode registerfield"
                        name="passcode"
                        placeholder="Your 6 digits code"
                        onChange={e => this.handleChange(e)}
                    />
                    <input
                        className="newpass registerfield"
                        name="newpass"
                        placeholder="Your new password"
                        onChange={e => this.handleChange(e)}
                        type="password"
                    />
                    <input
                        className="newpass registerfield"
                        name="newPassRepeat"
                        placeholder="Type your new password again"
                        onChange={e => this.handleChange(e)}
                        type="password"
                    />
                    {this.state.error &&
                        this.state.email !=
                            undefined(
                                <div className="error">
                                    Your passwords do no match!
                                </div>
                            )}

                    <HashRouter>
                        <button
                            className="submit-btn-register"
                            onClick={e => this.newpass(e)}
                        >
                            Reset <i className="fas fa-users"></i>
                        </button>{" "}
                    </HashRouter>
                </div>
            );
        }

        if (this.state.stage === 3) {
            return (
                <div>
                    {" "}
                    Your password was successfully changes. please{" "}
                    <Link to="/login" className="register">
                        Log in{" "}
                    </Link>
                    .{" "}
                </div>
            );
        }
    }
}
