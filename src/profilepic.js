import React from 'react';
import App from './app';


//only job is on click to show uploader. has function so is functional component
//receive props as parameters, gets passed down. Calls it in certain condition: onClick
export default function profilePic(props) {
    var defaultpicture;
    console.log('props from profilepic.js: ', props)
    if (props.picture ==  'https://s3.amazonaws.com/socialnetwork-spiced/null') {
        defaultpicture = '/defaultpicture.jpg'
    }
    else {
        defaultpicture = props.picture;
    }
    return (
    <div className="profilepicdiv">
        <img className="profilepic" onClick={props.toggleUploader} src={defaultpicture} alt={`${props.first} ${props.last}`} />
        <button className="change-profilepic-button" onClick={props.toggleUploader}><h3>Change</h3></button>
    </div>
    )
    //change state of App
    //app passesf ucniton to profile pic that does that
}
