import React from "react";
// import axios from "./axios";

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        //here we want to make a request to the server to get all the info about  the user with with the clicked numer.
        console.log("this.props.match.params.id", this.props.match.params.id);
        //we want the server to send back all info about requested user and the id of the currently logged in user. if these are the smae, we need to redirectd //them back to the /

        //this is a hard coded demo:
        if (this.props.match.params.od == 6) {
            //we want to redirect them ..
            this.props.history.push("/");
        }
        //we also want to redirect if the user doesn't exist.
    }
    render() {
        return (
            <div>
                <h1> hey from the other profile....</h1>
            </div>
        );
    }
}
