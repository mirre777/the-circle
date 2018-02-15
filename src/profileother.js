import React from 'react';
import axios from 'axios';
import App from './app';
import Friendrequests from './friendrequests';

export default class Profileother extends React.Component {
    constructor(props) {
        super(props);
        this.state={};
    }
    componentDidMount() {
        console.log('profileother, axios.get /user:id');
        axios.get('/get-user/' + this.props.match.params.id)
        // getUserInfo for this id: this.props.match.params.id
            .then(({data}) => {
                // console.log('profileother, componentDidMount, in .then, data profileother: ', data)
                if (data.ownProfile) {
                    this.props.history.push('/profile');
                }
                else {
                    this.setState ({
                        first: data.first,
                        last: data.last,
                        picture: data.picture,
                        favoritecolor: data.favoritecolor,
                        bio: data.bio,
                        friendStatus: data.friendStatus,
                        recipientid: data.recipientid,
                        senderid: data.senderid
                    })
                }
            })
            .catch(err => {
                console.log('in profileother, in componentDidMount, in .catch, error: ', err);
            })
    }


////////////////////////////////////////////////////////////////////////////////
    setStatus() {
        let recipientid;
        let status = this.state.friendStatus

        console.log('in setStatus, status: ', status);

        if (status == 1) {
            recipientid = this.props.match.params.id
        }

///UNDEFINED
        if (!status) {
            console.log('entered undefined if');
            axios.post('/user/' + this.props.match.params.id + '/makefriend', {
                status: 1
                // otheruserid: this.props.match.params.id
            })
                .then(results => {
                    if(results.data.friendRequestPending == true) {
                        console.log('friendrequests,results.data.friendRequestPending: ', results.data.friendRequestPending);
                        this.setState ({
                            friendStatus: 1,
                            recipientid: this.props.match.params.id
                        })
                    }
                    else {
                        console.log('setStatus, undefined if, then, friendRequestPending not true');
                    }
                })
        }

///PENDING
        if (status == 1) {
        console.log('entered pending if');
            if (this.props.recipientid == this.props.otheruserid) {
    ///CANCEL
                axios.post('/user/' + this.props.match.params.id + '/cancel', {
                })
                    .then(results => {
                        if(results.data.canceledFriendRequest == true) {
                            console.log('friendrequests,results.data.canceledFriendRequest: ', results.data.canceledFriendRequest);
                            this.setState ({
                                friendStatus: undefined
                            })
                        }
                        else {
                            console.log('setStatus, undefined if, then, canceledFriendRequest not true');
                        }
                    })
            }
    ///ACCEPT
            else {
            console.log('entered accept if');
            axios.post('/user/' + this.props.match.params.id + '/accept', {
                status: 2
            })
                .then(results => {
                    if(results.data.securedFriend == true) {
                        console.log('friendrequests,results.data.securedFriend: ', results.data.securedFriend);
                        this.setState ({
                            friendStatus: 2
                        })
                    }
                    else {
                        console.log('setStatus, undefined if, then, securedFriend not true');
                    }
                })
            }
        }

///DEFRIEND
        if (status == 2) {
            axios.post('/user/' + this.props.match.params.id + '/defriend', {
            })
                .then(results => {
                    if(results.data.deFriended == true) {
                        console.log('friendrequests,results.data.deFriended: ', results.data.deFriended);
                        this.setState ({
                            friendStatus: undefined
                        })
                    }
                    else {
                        console.log('setStatus, undefined if, then, deFriended not true');
                    }
                })
        }
    }
//////////////////////////////////////////////////////////////end of setStatus


    render() {
        console.log('in profileother, in render');
        return (
            <div className="profilediv">
            <h1>{this.state.first} {this.state.last}</h1>
                <img className="otherprofilepic" src={this.state.picture || '/defaultpicture.jpg'}/>
                <h3>Favorite color: {this.state. favoritecolor}</h3>
                <h3>Bio: {this.state. bio}</h3>

                    <div>
                        <Friendrequests
                        status={this.state.friendStatus}
                        recipientid={this.state.recipientid}
                        senderid={this.state.senderid}
                        otheruserid={this.props.match.params.id}
                        setStatus={(newStatus) => this.setStatus(newStatus)}
                        />
                    </div>

            </div>
            //exist? this.state.friendStatus : make friend request
            // nothing: make
            // friends: unfriend
            // else: who sent it: accept and cancel: reciepient is page viewed (cancel),  reciepeitn is not viewed page (so must be you, -accept)
        )
    }
}
