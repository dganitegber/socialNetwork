import React from "react";
// import axios from "./axios";
import ProfilePic from "./profilepic";
import BioEditor from "./BioEditor";

export default function Profile(props) {
    console.log("props", props);
    return (
        <div className="profileContainer">
            <ProfilePic
                className="largeProfilePic"
                picture_url={props.picture_url}
                clickHandler={props.clickHandler}
                // onClick={e => props.clickHandler(e)}
            />
            <p onClick={event => props.clickHandler2(event)}>
                Tell us something about yourself
            </p>
            <BioEditor />
        </div>
    );
}
