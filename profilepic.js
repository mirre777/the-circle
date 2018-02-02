import React from 'react';
import App from './app';
import {Logo} from './logo';

//only job is on click to show uploader
//receive props as parameters, gets passed down. Calls it in certain condition: onClick
export default function profilePic(props) {
    //no image
    if(!props.image) {
        return null;
        //or image = "./defaultpic.png"
    }
    return
    <div>
        <img className="profilepic" onClick={this.props.showUploader} src={props.image} alt={props.first} {props.last} />
        <div><a href={"/logout"}>Unlog</a></div>
    </div>
    //change state of App
    //app passesf ucniton to profile pic that does that
}
