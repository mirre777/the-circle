//all the data lives in app.js
//getting profile picture from app. when state changes,
//app sends it to every component that uses it (profile picture)


import React from 'react';
import axios from 'axios';
import Profilepic from "./profilepic";
import Uploader from "./uploader";
import {Logo} from './logo';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        //when user changes profile pic, we need to see update
        this.state = {
            //now false, until profile pic is clicked
            uploaderShouldBeVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
    }
    //called right after first time it call render and put html element in DOM (lifecycle)
    componentDidMount() {
        //create server route app.post as well
        axios.get('/user')
        .then(({data}) => {
            this.setState ({
                id: data.id,
                first: data.first,
                image: data.picture
            })
        })
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
        console.log('this.state: ', this.state);
        if(!this.state.id) {
            //no id, no information
            //return message 'loading'
            return null;
        }
        return (
            //when showUploader is called (by clicking on the profile pic), it will change uploaderShouldBeVisible to true
            <div>
                <Logo />
                <Profilepic image={this.state.image} showUploader={() => this.showUploader()} />
                {this.state.uploaderShouldBeVisible && <Uploader setImage={(pictureUrl) => this.setImage(pictureUrl)} />}

            </div>
            //
        )
    }
}
