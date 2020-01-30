import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: ""
        };
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => this.setState(data));
        console.log(this.state);
    }

    render() {
        if (!this.state.id) {
            return <img src="/progressbar.gif" alt="Loading..." />;
        }
        return (
            <div>
                <img className="logotop" src="/logo.png" alt="Logo" />
                <img className="profileSmall" />
                <ProfilePic
                    clickHandler={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                    imageUrl={this.state.imageUrl}
                    first={this.state.first}
                    last={this.state.last}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImageUrl={imageUrl => this.setState({ imageUrl })}
                    />
                )}
            </div>
        );
    }
}
