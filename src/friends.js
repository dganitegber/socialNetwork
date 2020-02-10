import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    endFriendship
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    // const friendswannabes = useSelector(state => state.friendswannabes); //oh here you have to filter if friend or wannabe
    const friends = useSelector(
        // console.log(friendswannabes),
        state =>
            state.friendswannabes &&
            state.friendswannabes.filter(friends => friends.accepted == true)
    );
    const wannabes = useSelector(
        state =>
            state.friendswannabes &&
            state.friendswannabes.filter(wannabes => wannabes.accepted == false)
    );
    console.log("wannabes", wannabes);
    console.log("friends", friends);

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    if (!friends) {
        return <div>No friends</div>;
    }
    if (!wannabes) {
        return <div>No wannabes</div>;
    }
    return (
        <div>
            <div>
                <h1>Wannabes</h1>
                <ul className="display-flex">
                    {wannabes.map(person => {
                        return (
                            <li key={person.id}>
                                <Link
                                    className="link"
                                    to={`/user/${person.id}`}
                                >
                                    <div className="other-profile">
                                        <div className="foto-and-name-container">
                                            <p>{`${person.first} ${person.last}`}</p>
                                            <img
                                                className="profilepic-small"
                                                src={person.profpic}
                                            />
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                acceptFriendRequest(person.id)
                                            )
                                        }
                                        name="button"
                                        className="button"
                                    >
                                        Accept Friend Request
                                    </button>
                                    {/* {error && (
                                        <div className="error">
                                            Generic error happened
                                        </div>
                                    )} */}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <br></br>
            <div>
                <h1>Friends</h1>
                <ul className="display-flex">
                    {friends.map(person => {
                        return (
                            <li key={person.id}>
                                <Link
                                    className="link"
                                    to={`/user/${person.id}`}
                                >
                                    <div className="other-profile">
                                        <div className="foto-and-name-container">
                                            <p>{`${person.first} ${person.last}`}</p>
                                            <img
                                                className="profilepic-small"
                                                src={person.profpic}
                                            />
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    <button
                                        onClick={() =>
                                            dispatch(endFriendship(person.id))
                                        }
                                        name="button"
                                        className="button"
                                    >
                                        End Friednship
                                    </button>
                                    {/* {error && (
                                        <div className="error">
                                            Generic error happened
                                        </div>
                                    )} */}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
        // <div className="user">
        //     <img src={users[0].image} />
        //     <div className="buttons">
        //         <button onClick={e => dispatch(makeHot(users[0].id))}>
        //             Hot
        //         </button>
        //         <button onClick={e => dispatch(makeNot(users[0].id))}>
        //             Not
        //         </button>
        //     </div>
        // </div>
        // <nav>
        //     <Link to="/hot">See who&apos;s hot</Link>
        //     <Link to="/not">See who&apos;s not</Link>
        // </nav>
    );
}
///when this component mounts dispatch an action - which fetches all thw friedns and wannabes and put it into redux
//here we also have to split the one big array into two seperate arrays: hint: useSelector twice, then render the two lit on screen
