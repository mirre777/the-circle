import React from "react";
import { Registration } from "./registration";
import { Login } from "./login";


//call registration
export function Welcome() {
    return (

            <div className="welcomeDiv">
                <h1>register your person</h1>
                <Registration />
                <h1>log in</h1>
                <Login />
            </div>
    )
}
//or call Log in, depending on url.
//state change?
