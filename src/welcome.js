import React from "react";
import { Registration } from "./registration";
import { Login } from "./login";
import {HashRouter, Route} from 'react-router-dom';

//and link


//call registration
export class Welcome extends React.Component {
    render() {

        return (
            <section>
                <HashRouter>
                    <div className="welcomeDiv">
                        <h1>register your person</h1>
                        <Route exact path="/register" component={Registration}
                        />

                        <h1>or log in</h1>
                        <Route path="/login" component={Login}
                        />
                    </div>
                </HashRouter>
            </section>
        )
    }
}
//or call Log in, depending on url.
//state change?
