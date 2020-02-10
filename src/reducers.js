export default function reducer(state = {}, action) {
    //this is going to be one big function with a bunch of if sttements in it:
    // if (action.type == "ALL_CAPS_WITH_UNDERSCORES") {
    //     //make copy of gloabl state, immuably change objects and so on
    //     state = {
    //         ...state,
    //         addProperty: "newValue",
    //         overwriteExistingProperty: "new Value"
    //     };
    //     //possible methods: map - good for changing item(s) in an array,
    //     //filter - removes item(s) from an array,
    //     //concat - combine two or more arrays into ony array,
    //     //...(spread operator) - copy arrays and objects and add properties to those copies.
    //     //Object.assign - make copies of objects
    //     //rather use ...insread of object.assign
    //
    //     // reducers will have one if blcok per actoin
    // }

    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendswannabes: action.friendswannabes
        };
        console.log("state from reducer: ", state);
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        console.log("ACCEPT_FRIEND", action, "hi from reducer");
        state = {
            ...state,
            friendswannabes: state.friendswannabes.map(person => {
                console.log("hi from reducer");
                if (person.id != action.id) {
                    return person;
                } else {
                    return {
                        ...person,
                        accepted: true
                    };
                }
            })
        };
    }

    if (action.type === "END_FRIENDSHIP") {
        console.log("END_FRIENDSHIP", action, "hi from reducer");
        state = {
            ...state,
            friendswannabes: state.friendswannabes.filter(person => {
                if (person.id != action.id) {
                    return person;
                } else {
                    return person.id !== action.id; //this syntax comes from stack overflow, i dont really understand why this works
                }
            })
        };
    }

    //
    return state;
}
