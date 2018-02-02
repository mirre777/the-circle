//all the data lives in app.js
//getting profile picture from app. when state changes, app sends it to every component that uses it (profile picture)


import React from 'react';
import axios from 'axios';
import Profilepic from './profilepic';
import Uploader from 'uploader';


export default class App extends React.component {
    constructor(props) {
        super(props);
        //when user changes profile pic, we need to see update
        this.state = {
            //now false, until profile pic is clicked
            uploaderShouldBeVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
    }
    //called right after first time it call render and put html element in DOM (lifecycle)
    componentDidMount() {
        axios.get('/user')
        //.then
        //id: data.id
        //get first, localhost
        //pass id (test if data has loaded)
    }
    showUploader() {
        this.setState ({
            uploaderShouldBeVisible: true
        })
    }
    setImage(pictureUrl) {
        this.setState ({
            image: pictureUrl
        })
    }
    render() {
        if(!props.state.id) {
            //no id, no information
            //return message 'loading'
            return null;
        }
        return (
            //when showUploader is called (by clicking on the profile pic), it will change uploaderShouldBeVisible to true
            <div>
                <Profilepic image={this.state.image} showUploader={() => this.showUploader()} />
                {this.state.uploaderShouldBeVisible && <Uploader setImage={(pictureUrl) => this.setImage(pictureUrl)} />}

            </div>
            //
        )
    }
}
