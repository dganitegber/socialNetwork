import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function Search() {
    // const [greetee, setGreetee] = useState("World");
    const [users, setUsers] = useState([]); //array for db return
    const [user, setUser] = useState(); //state for user input

    useEffect(() => {
        let ignore = false;
        console.log("different lable", user);
        if (!user) {
            (async () => {
                try {
                    const { data } = await axios.get("/getLastUsers.json");
                    console.log(data);
                    console.log(user);
                    setUsers(data);

                    // "http://flame-egg.glitch.me/?q=" + country
                    if (!ignore) {
                        console.log(data);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        } else {
            console.log("user", user);
            axios.get("/getinput/" + user + ".json").then(data => {
                console.log("data", data);
                setUsers(data.data);
            });
        }
        return () => {
            ignore = true;
        };
    }, [user]);

    // useEffect(() => {});

    // const onChange = ({ target }) => {
    //     // console.log('target: ', target);
    //     setGreetee(target.value);
    // };

    console.log("users", users);
    const onUserSearch = ({ target }) => {
        setUser(target.value);
        console.log("target.value", target.value);
    };

    return (
        <div>
            <h1>Search users</h1>
            <input
                onChange={onUserSearch}
                type="text"
                placeholder="Search a user"
            />
            <ul>
                {users.map(user => {
                    return (
                        <li key={user.id} className="latestUsers">
                            <Link to={"/user/" + user.id}>
                                <p className="latesttName">
                                    {" "}
                                    {user.first} {user.last}
                                </p>
                                {(function() {
                                    if (user.profpic == null) {
                                        return (
                                            <img
                                                key={user.profpic}
                                                src="./profile.png"
                                            />
                                        );
                                    } else {
                                        return (
                                            <img
                                                key={user.profpic}
                                                src={user.profpic}
                                            />
                                        );
                                    }
                                })()}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
//
