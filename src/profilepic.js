import React from "react";
// import axios from "./axios";

export default function ProfilePic(props) {
    console.log("props: ", props);
    // const clickHandler = props.clickHandler;
    // const first = props.first;
    // const last = props.last;

    return (
        <div>
            <img
                src={props.picture_url}
                className="largeProfilePic"
                onClick={e => props.clickHandler(e)}
            />
        </div>
    );
}
