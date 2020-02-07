import React from "react";
import axios from "./axios";

export default class NewFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        axios
            .get("/friendsStatus/" + this.props.otherUserId)
            .then(({ data }) => {
                if (data.accepted === true) {
                    console.log("im in the first");
                    this.setState({
                        Text: "Remove Friend"
                    });
                } else if (data.rows.length === 0) {
                    console.log("data", data);

                    this.setState({
                        Text: "Add Friend"
                    });

                    // this.props.match.params.id)
                } else {
                    if (this.props.otherUserId === data.rows[0].asked_by) {
                        console.log("i'm in the first", this.props.otherUserId);
                        this.setState({
                            Text: "Accept friend request"
                        });
                    } else {
                        console.log("i'm in the second");
                        console.log(
                            data,
                            "my id",
                            this.props.id,
                            "asked to",
                            data.rows[0].asked_to,
                            "other user",
                            this.props.otherUserId,
                            "asked by",
                            data.rows[0].asked_by
                        );

                        this.setState({
                            Text: "Friend request sent",
                            disabled: true
                        });
                    }
                }
            });
    }

    handleClick() {
        console.log("i want friends");
        if (this.state.Text === "Accept friend request") {
            console.log("im in one");
            axios
                .post("/acceptfriends/" + this.props.otherUserId)
                .then(({ data }) => {
                    console.log(data[0].accepted);
                });
        } else if (this.state.Text === "Add Friend") {
            console.log("im in two");
            axios
                .post("/addfriend/" + this.props.otherUserId)
                .then(({ data }) => {
                    this.setState(data);
                    this.setState({
                        Text: "Friend request sent",
                        disabled: true
                    });
                    console.log(this.state);
                });
        }
    }

    render() {
        return (
            <div>
                <button
                    onClick={e => this.handleClick(e)}
                    className="addFriend"
                    disabled={this.state.disabled}
                >
                    {this.state.Text}
                </button>
            </div>
        );
    }
}
