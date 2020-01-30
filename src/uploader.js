import React from "react";
// import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
    }

    fileSelectedHandler(event) {
        console.log(event);
    }

    render() {
        return (
            <div className="Uploader">
                <input type="file" onChange={this.fileSelectedHandler} />
            </div>
        );
    }
}
