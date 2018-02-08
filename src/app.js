//all the data lives in app.js
//getting profile picture from app. when state changes,
//app sends it to every component that uses it (profile picture)


import React from 'react';
import axios from 'axios';
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import {Logo} from './logo';
import {BrowserRouter, Route} from 'react-router-dom';
import Profile from './profile';
import Profileother from './profileother';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        //now false, until profile pic is clicked
            uploaderShouldBeVisible: false
        };
        this.setImage = this.setImage.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    //called right after first time it calls render and put html element in DOM (lifecycle)
    componentDidMount() {
        axios.get('/user')
        .then(({data}) => {
            console.log('data: ', data)
            this.setState ({
                id: data.id,
                first: data.first,
                last: data.last,
                picture: data.picture,
                favoritecolor: data.favoritecolor,
                bio: data.bio
            })
        })
    }
    toggleUploader() {
        this.setState ({
            uploaderShouldBeVisible: !this.state.uploaderShouldBeVisible
        })
    }
    setImage(filename) {
        console.log('filename: ', filename);
        this.setState ({
            picture: filename
        })
        this.toggleUploader();
    }
    setBio(newBio) {
        console.log('in app.js setBio, newBio: ', newBio)
        this.setState ({
            bio: newBio
        })
    }
    render() {
        if(!this.state.id) {
            //no id, no information
            //return message 'loading'
            return null;
        }
        return (
            //when toggleUploader is called (by clicking on the profile pic), it will change the state of uploaderShouldBeVisible to true
            //<Logo />
            <BrowserRouter>
                <div>
                    <Route path="/profile" render={() => (
                        <Profile
                        id={this.state.id}
                        first={this.state.first}
                        last={this.state.last}
                        favoritecolor={this.state.favoritecolor}
                        picture={this.state.picture}
                        bio={this.state.bio}
                        setBio={this.setBio}
                        />
                    )}/>
                    <Route path="/user/:id" render={(props) => (
                        <Profileother
                        id={props.match.params.id}
                        first={this.state.first}
                        last={this.state.last}
                        favoritecolor={this.state.favoritecolor}
                        picture={this.state.picture}
                        bio={this.state.bio}
                        />
                    )}/>
                    <Profilepic
                    picture={this.state.picture}
                    toggleUploader={() => this.toggleUploader()}
                    first={this.state.first}
                    last={this.state.last} />
                    {this.state.uploaderShouldBeVisible &&
                        <Uploader
                            setImage={(filename) => this.setImage(filename)}
                            toggleUploader={() => this.toggleUploader()} />}
                </div>
            </BrowserRouter>
        )
    }
}
