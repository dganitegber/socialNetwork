import React from "react";
import axios from "./axios";

export default class NewFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log("this statge: ", this.props);
        axios
            .get("/friendsStatus/" + this.props.otherUserId)
            // this.props.match.params.id)
            .then(({ data }) => {
                // this.setState(data);
                if (data.length === 0) {
                    console.log("im in 1st if");
                    axios
                        .get("/friendsStatusReverse/" + this.props.otherUserId)
                        .then(({ data }) => {
                            if (data.length === 0) {
                                console.log("im in  if");
                                this.setState({ Text: "Add Friend" });
                            } else {
                                console.log("im in else");
                                this.setState({
                                    Text: "Accept friend request"
                                });
                            }
                        });
                } else {
                    console.log("im in big else");
                    this.setState({ Text: "Friend request sent" });
                }
            })
            .then(() => console.log("this statge: ", this.state));
    }

    makeFriend() {
        console.log("i want friends");
        axios.post("/addfriend/" + this.props.otherUserId).then(({ data }) => {
            this.setState(data);
            this.setState({ Text: "Friend request sent" });
            console.log(this.state);
        });
    }

    render() {
        return (
            <div>
                <button onClick={e => this.makeFriend(e)} className="addFriend">
                    {this.state.Text}
                </button>
            </div>
        );
    }
}
