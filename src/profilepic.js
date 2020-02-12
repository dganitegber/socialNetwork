import React from "react";
// import axios from "./axios";

export default function ProfilePic(props) {
    // const clickHandler = props.clickHandler;
    // const first = props.first;
    // const last = props.last;
    console.log("props", props);
    return (
        <div className="largeProfilePic">
            <h1>
                {" "}
                {props.first} {props.last}
            </h1>
            <img
                src={props.picture_url}
                first={props.first}
                last={props.last}
                className="largeProfilePic"
                onClick={e => props.clickHandler(e)}
            />
        </div>
    );
}
