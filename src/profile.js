import React from "react";
// import axios from "./axios";
import ProfilePic from "./profilepic";
import BioEditor from "./BioEditor";

export default function Profile(props) {
    return (
        <div className="profile">
            <div className="profileContainer">
                <ProfilePic
                    className="largeProfilePic"
                    picture_url={props.picture_url}
                    clickHandler={props.clickHandler}
                />
            </div>
            <div>
                <BioEditor clickHandler2={props.clickHandler2} />
            </div>
        </div>
    );
}
