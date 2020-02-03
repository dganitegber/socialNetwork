import React from "react";
import Login from "./login";
import Forgotpass from "./Forgotpass";

import { HashRouter, Route } from "react-router-dom";
// import Changer from "./changer";
import Registration from "./registration";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            password: "",
            email: "",
            bio: ""
        };
    }
    render() {
        return (
            <div>
                <div
                    style={{
                        color: "darkblue",
                        fontFamily: "Lobster",
                        fontSize: "70px"
                    }}
                >
                    welcome to my network!
                </div>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route path="/forgotpass" component={Forgotpass} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
