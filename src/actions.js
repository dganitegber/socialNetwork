import axios from "./axios";
//ALL actions creators will return objects that have a type property
//all types should be written ALL_CPAS_WITH_UNDERSCORES
// }
export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friendswannabes");
    console.log("Data from axios receive friendswannabes", data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendswannabes: data
    };
}

export async function acceptFriendRequest(id) {
    console.log("hello from acceptfreidnrequest");
    console.log("id in accept friends request", id);
    await axios.post("/acceptfriends/" + id);
    console.log("after axios");
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function endFriendship(id) {
    await axios.post("/end-friendship/" + id);
    return {
        type: "END_FRIENDSHIP",
        id
    };
}
