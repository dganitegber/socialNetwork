import React from "react";
import axios from "./axios"; //from now on always require the copy of axios from axios.js instead of from the module
// import { HashRouter, Route } from "react-router-dom";
// import { Link } from "react-router-dom";
export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { BioEditorVisible: false };

        this.handleChange = this.handleChange.bind(this);
        this.postBio = this.postBio.bind(this);
    }
    componentDidMount() {
        console.log(this.state.picture_url);
        axios.get("/user").then(({ data }) => this.setState(data));
        console.log("this.state", this.state);
        console.log(this.state.bio);
    }
    updateBio(img) {
        console.log("this state", this.state);
        console.log("image", img);
        this.setState({ picture_url: img, uploaderVisible: false });
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    postBio() {
        event.preventDefault();

        axios.post("/bio", {
            bio: this.state.value
        });
    }

    render() {
        return (
            <div>
                <div clasdNam="myBio"></div>
                {this.state.bio}
                <div className="BioEditor">
                    {this.state.BioEditorVisible == true && (
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
                    )}
                </div>
            </div>
        );
    }
}
