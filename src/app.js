import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
// import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { OtherProfile } from "./other-profile";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: ""
        };
        this.updateImgUrl = this.updateImgUrl.bind(this);
        // this.updateBio = this.updateBio.bind(this);
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

    componentDidMount() {
        axios.get("/user").then(({ data }) => this.setState(data));
    }

    updateImgUrl(img) {
        this.setState({ picture_url: img, uploaderVisible: false });
    }

    // updateBio(bio) {
    //     this.setState({ bio: bio });
    // }

    render() {
        return (
            <BrowserRouter>
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
                    <div className="profilbio">
                        <Profile
                            bio={this.state.bio}
                            picture_url={this.state.picture_url}
                            className="largeProfilePic"
                            clickHandler={() =>
                                this.setState({ uploaderVisible: true })
                            }
                            clickHandler2={() =>
                                this.setState({ bioEditorVisible: true })
                            }
                        />
                        <Route
                            exact
                            path="/user/:id"
                            component={OtherProfile}
                        />
                    </div>
                    {this.state.uploaderVisible && (
                        <Uploader updateImgUrl={this.updateImgUrl} />
                    )}{" "}
                </div>
            </BrowserRouter>
        );
    }
}
