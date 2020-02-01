import React from "react";
// import axios from "./axios";
import ProfilePic from "./profilepic";
// import BioEditor from "./BioEditor";

export default function Profile(props) {
    console.log("props from profile", props);

    return (
        <div className="profileContainer">
            <ProfilePic
                className="largeProfilePic"
                picture_url={props.picture_url}
                clickHandler={props.clickHandler}
                // onClick={e => props.clickHandler(e)}
            />
            <h3 clickHandler={() => this.setState({ BioEditorVisible: true })}>
                Tell us something about yourself
            </h3>
        </div>
    );
}
