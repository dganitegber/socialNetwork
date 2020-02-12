import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import NewFriends from "./newFriends";

// import BioEditor from "./BioEditor";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("props", this.props.id);
        axios
            .get("/otheruser/" + this.props.match.params.id)
            .then(({ data }) => {
                console.log("data", data.loggedUser, data.id);
                if (data.loggedUser == data.id) {
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                }
            });
    }

    //here we want to make a request to the server to get all the info about  the user with with the clicked numer.
    //we want the server to send back al info about requested user and the id of the currently logged in user. if these are the smae, we need to redirectd //them back to the /

    //this is a hard coded demo:
    // if (this.props.match.params.od == 6) {
    //we want to redirect them ..
    // this.props.history.push("/");
    // }

    //we also want to redirect if the user doesn't exist.

    render() {
        if (this.state.id == this.props.match.params.id) {
            console.log("hi im here");
        }
        return (
            <div>
                <h1>
                    {" "}
                    {this.state.first} {this.state.last}
                </h1>
                <div className="profile">
                    <div className="profileContainer">
                        <ProfilePic
                            className="largeProfilePic"
                            picture_url={this.state.profpic}
                            clickHandler={this.state.clickHandler}
                        />
                        <div className="thisUserBio">{this.state.bio}</div>

                        {this.state.id == this.props.match.params.id && (
                            <NewFriends
                                otherUserId={this.props.match.params.id}
                                id={this.state.id}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
//
// {
//     (function() {
//         if (this.state.profpic == null) {
//             return (
//                 <ProfilePic
//                     className="largeProfilePic"
//                     picture_url="./profile.png"
//                     clickHandler={this.state.clickHandler}
//                 />
//             );
//         } else {
//             <ProfilePic
//                 className="largeProfilePic"
//                 picture_url={this.state.profpic}
//                 clickHandler={this.state.clickHandler}
//             />;
//         }
//     })();
// }
