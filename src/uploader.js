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
        //create new instance of formData and append file to it
        const formData = new formData()
        //formData.append(name, value);
        formData.append('file', this.file)
        axios.post('/upload', formData)
            .then(results => {
                console.log('in .then of axios.post /upload');
                console.log('   results.data: ', results.data);
                //if: gets success true from app.post
                if (results.data.success == true) {
                    //pass setImage in App.js the pictureUrl: filename is the complete url
                    this.props.setImage(results.data.filename)
                }
                else {
                    this.setState ({
                        error: true
                    })
                }
            })
            .catch(err => {
                console.log('   in .catch, err: ', err)
            })
        //create server route app.post as well
    }
    render() {
        <div>
            <h2>Choose your identity</h2>
            <input type="file" name="file" onChange={(e) => this.chooseFile(e)} />
            <button onClick={(e) => this.uploadFile(e)}>Upload</button>
        </div>
    }
}
