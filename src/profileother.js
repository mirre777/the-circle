import React from 'react';
import axios from 'axios';
import App from './app';

export default class Profileother extends React.Component {
    constructor(props) {
        super(props);
        this.state={};
    }
    componentDidMount() {
        console.log('in profileother, in getOtherProfile, in axios.get /user:id');
        axios.get('/get-user/' + this.props.id)
        //getUserInfo for this id: this.props.match.params.id
        //server route too
            .then(({data}) => {
                    console.log('data: ', data)
                    this.setState ({
                        first: data.first,
                        last: data.last,
                        picture: data.picture,
                        favoritecolor: data.favoritecolor,
                        bio: data.bio
                    })
            })
            .catch(err => {
                console.log('in profileother, in componentDidMount, in .catch, error: ', err);
            })
    }
    // var defaultpicture;
    // if (props.picture ==  'https://s3.amazonaws.com/spicedling/null') {
    //     defaultpicture = 'defaultpicture.jpg'
    // }
    // else {
    //     defaultpicture = this.state.picture;
    // }
    //if userid is user/:id, then redirect to /profile
    // by using this.props.history.push('/profile');
    render() {
        console.log('in profileother, in render');
        return (
            <div className="profilediv">
            <h1>{this.state.first} {this.state.last}</h1>
                <img className="otherprofilepic" src={this.state.picture || '/defaultpicture.jpg'}/>
                <h3>{this.state. favoritecolor}</h3>
                <h3>{this.state. bio}</h3>
            </div>
        )
    }
}
