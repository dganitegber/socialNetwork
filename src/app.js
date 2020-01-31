import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: ""
        };
        this.updateImgUrl = this.updateImgUrl.bind(this);
    }
    componentDidMount() {
        console.log(this.state.picture_url);
        axios.get("/user").then(({ data }) => this.setState(data));
        console.log("this.state", this.state);
        console.log(this.state.picture_url);
    }

    updateImgUrl(img) {
        console.log(this.state);
        console.log("image", img);
        this.setState({ picture_url: img, uploaderVisible: false });
    }

    render() {
        return (
            <div>
                <div className="topBar">
                    <img className="logotop" src="/logo.png" alt="Logo" />
                    <p className="welcome">
                        {" "}
                        Welcome back, {this.state.first}!
                    </p>
                    <img
                        className="profileSmall"
                        src={this.state.picture_url}
                    />
                </div>
                <ProfilePic
                    className="largeProfilePic"
                    clickHandler={() =>
                        this.setState({ uploaderVisible: true })
                    }
                    picture_url={this.state.picture_url}
                />
                {this.state.uploaderVisible && (
                    <Uploader updateImgUrl={this.updateImgUrl} />
                )}{" "}
            </div>
        );
    }
}
