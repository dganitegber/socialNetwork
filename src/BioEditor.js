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
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            this.setState(data), console.log("this.data", data);
            console.log(this.state.bio);
        });
    }
    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }
    editBio(e) {
        e.preventDefault();

        this.setState({
            bioEditorVisible: true
        });
    }

    postBio(e) {
        e.preventDefault();
        axios
            .post("/bio", {
                bio: this.state.value
            })
            .then(data => {
                this.setState({ bio: data.data, bioEditorVisible: false });
            });
    }

    render() {
        console.log("this state", this.state);
        return (
            <div className="bioeditor">
                {this.state.bioEditorVisible != true && (
                    <div className="myBio">{this.state.bio}</div>
                )}{" "}
                <div className="BioEditor">
                    {
                        (!this.props.bio,
                        this.state.bioEditorVisible === true && (
                            <form>
                                <p>Tell us something about yourself</p>
                                <textarea
                                    onChange={e => this.handleChange(e)}
                                    name="bio"
                                    rows="10"
                                    cols="50"
                                    placeholder={this.state.bio}
                                />

                                <submit onClick={e => this.postBio(e)}>
                                    {" "}
                                    submit{" "}
                                </submit>
                            </form>
                        ))
                    }{" "}
                </div>
                {this.state.bioEditorVisible != true && (
                    <button className="editBio" onClick={e => this.editBio(e)}>
                        {" "}
                        edit bio{" "}
                    </button>
                )}
            </div>
        );
    }
}
