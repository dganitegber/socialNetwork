import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
// import BioEditor from "./BioEditor";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/otheruser/" + this.props.match.params.id)
            .then(({ data }) => {
                console.log("res.data", data);
                this.setState(data);
                console.log(this.state);
            });
    }
    //here we want to make a request to the server to get all the info about  the user with with the clicked numer.
    //we want the server to send back all info about requested user and the id of the currently logged in user. if these are the smae, we need to redirectd //them back to the /

    //this is a hard coded demo:
    // if (this.props.match.params.od == 6) {
    //we want to redirect them ..
    // this.props.history.push("/");
    // }

    //we also want to redirect if the user doesn't exist.

    render() {
        return (
            <div>
                <h1>
                    {" "}
                    {this.state.first} {this.state.last}.
                </h1>
                <div className="profile">
                    <div className="profileContainer">
                        <ProfilePic
                            className="largeProfilePic"
                            picture_url={this.state.profpic}
                            clickHandler={this.state.clickHandler}
                        />
                        <div className="thisUserBio">{this.state.bio}</div>
                    </div>
                </div>
            </div>
        );
    }
}
