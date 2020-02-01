import React from "react";
import axios from "./axios"; //from now on always require the copy of axios from axios.js instead of from the module
// import { HashRouter, Route } from "react-router-dom";
// import { Link } from "react-router-dom";
export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.postBio = this.postBio.bind(this);
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    postBio() {
        event.preventDefault();

        console.log("i clicked postbio");
        axios
            .post("/bio", {
                bio: this.state.value
            })
            .then(console.log("hi"));
    }

    render() {
        return (
            <div className="BioEditor">
                <form>
                    <textarea
                        value={this.state.value}
                        onChange={e => this.handleChange(e)}
                    />
                    <submit
                        name="bio"
                        rows="10"
                        cols="10"
                        onClick={e => this.postBio(e)}
                    >
                        {" "}
                        submit{" "}
                    </submit>
                </form>
            </div>
        );
    }
}
