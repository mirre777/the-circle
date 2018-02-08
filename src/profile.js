import React from 'react';
import axios from 'axios';
import App from './app';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioShouldBeVisible: false
        };
        this.toggleBio = this.toggleBio.bind(this);

    }
    toggleBio() {
        this.setState ({
            bioShouldBeVisible: !this.state.bioShouldBeVisible
        },
            function() {
                console.log('bio toggled, this.state', this.state);
            }
        )
    }
    setFieldValue(e) {
        this[e.target.name] = e.target.value
    }
    writeBio(e) {
        e.preventDefault();
        console.log('in profile, writeBio');
        axios.post('/upload-bio', {
            bio: this.newBio
            //need it in app.post route
        })
            .then(results => {
                console.log('in writeBio, results.data: ', results.data);
                if (results.data.success == true) {
                    this.props.setBio(results.data.bio);
                    this.toggleBio();
                }
                else {
                    this.setState ({
                        error: true
                    })
                }
            })
            .catch(err => {
                console.log('in writeBio, in .catch, error: ', err);
            })

    }
    //1 function to write setBio
    //2 server, database
    //3 then call setBio upon submit of the new text
    render() {
        console.log('this.props from profile.js: ', this.props);
        return (
        <div className="profilediv">
            <h1>profile</h1>
            <h3>{this.props.first}</h3>
            <h3>{this.props.last}</h3>
            <h3>{this.props.favoritecolor}</h3>
            <h3>{this.props.bio}</h3>
            <button className="writebio-open-button" onClick={this.toggleBio}><h3>Write your bio</h3></button>

            {this.state.bioShouldBeVisible &&
                <div>
                    <input className="input" name="newBio" placeholder="write your bio" onChange={e => this.setFieldValue(e)}/>
                    <input className="input" className="submit-button" type="submit" onClick={e => this.writeBio(e)}/>
                    <button className="writebio-close-button" onClick={this.toggleBio}>Close</button>
                </div>
            }
            <button className="logout-button"><a href={"/logout"}>Unlog</a></button>
        </div>
    )
        //onclick open bio edit modal
        //input field upon click, call setbio and pass it the input value
        //to app.js
        //server route, calls db functional
        //db update the bio
        //returns successfull
        //success to client. call setBio(newvalue)
    }
}
