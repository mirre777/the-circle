import React from 'react';
import axios from 'axios';
import {Logo} from './logo';

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.chooseFile = this.chooseFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);

    }
    chooseFile(e) {
        this.file = e.target.files[0];
    }
    uploadFile() {
        console.log('in uploader, uploadFile');
        //create new instance of formData and append file to it
        const formData = new FormData()
        //formData.append(name, value);
        formData.append('file', this.file)
        axios.post('/upload', formData)
            .then(results => {
                console.log('in .then of axios.post /upload, in .then');
                console.log('   results.data: ', results.data);
                //if: gets success true from app.post('/upload')
                if (results.data.success == true) {
                    console.log('in axios.post /upload, got success response from app.post /upload')
                //pass setImage in App.js the pictureUrl: filename is the complete url
                    this.props.setImage(results.data.picture);
                    console.log('results.data.picture: ', results.data.picture);
                }
                else {
                    this.setState ({
                        error: true
                    })
                }
            })
            .catch(err => {
                console.log('uploader, uploadFile, in .catch, err: ', err)
            })
    }
    render() {
        return (
            <div className="uploaddiv">
            <h2>Choose your identity</h2>
            <input type="file" name="file" onChange={(e) => this.chooseFile(e)} />
            <button onClick={(e) => this.uploadFile(e)}>Upload</button>
            <button className="upload-close-button" onClick={this.props.toggleUploader}>Close</button>
            </div>
            //uploaderShouldBeVisible: false
        )
    }
}
