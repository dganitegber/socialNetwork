export default function reducer(state = {}, action) {
    if (action.type === "ALL_CPAS_WITH_UNDERSCORES") {
        state = {
            ...state,
            friendsWannabes: "yoo"
        };
        //to change thins immutably:
        //map = good for changing item(s) in an array
        //filter = filtering out an item from an array
        //concat = combine two or more arrays together.
        // ... spread operator
    }
}
