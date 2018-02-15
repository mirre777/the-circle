import React from 'react';
import axios from 'axios';
import App from './app';
//create/send/pending = 1
//cancel = 3
//accept = 4

export default class Friendrequests extends React.Component {
    constructor(props) {
        super(props);
        this.state={};
        // this.clickHandler = this.clickHandler.bind(this);
    }


    // clickHandler() {
    //     let newStatus;
    //     const status = this.props.status;
    //     const recipientid = this.props.recipientid;
    //     const otheruserid = this.props.otheruserid;
    //     if (status == 1) {
    //         if (recipientid != otheruserid) {
    //             newStatus = 2;
    //         }
    //     }
    //     else if (status == 2) {
    //         newStatus = undefined;
    //     }
    //     else if (!status) {
    //         newStatus = 1;
    //     }
    //     this.props.setStatus(newStatus)
    // }

    /////////////////MOVED THIS TO SETSTATUS IN PROFILEOTHER
    // makeFriend(){
    //     console.log('friendrequests, makeFriend');
    //     //send to server
    //     axios.post('/user/' + this.props.otheruserid + '/makefriend', {
    //         status: 1
    //     })
    //     //results from server
    //         .then(results => {
    //             if(results.data.friendRequestPending == true) {
    //                 console.log('friendrequests, makeFriend, in .then, results.data.friendRequestPending: ', results.data.friendRequestPending);
    //                 this.props.setStatus ({
    //                     status: 1
    //                 })
    //             }
    //             else {
    //                 this.setState ({
    //                     error: true
    //                 })
    //             }
    //         })
    //         .catch(err => {
    //             console.log('friendrequests, makeFriend, in .catch, err: ', err)
    //         });
    // }
    render() {
        console.log('fr, this.props.status: ', this.props.status);
        console.log('fr,this.props.recipientid: ', this.props.recipientid);
        console.log('fr,this.props.otheruserid: ', this.props.otheruserid);
        ////////////////////////////////////////////////////////clickHandler: upon click of the button
        //NOTHING undefined: set status to 1 PENDING
        //PENDING status 1 and recipient is not otheruser (so i am receiving): set status to 2 ACCEPT
        //FRIENDS status 2, from both sides set status undefined NOTHING
        return (
            <div>
            <button className="friend-button" onClick={() => this.props.setStatus()}>
                {!this.props.status && 'Send friend request'}
                {this.props.status == 1 && this.props.recipientid == this.props.otheruserid && 'Cancel'}
                {this.props.status == 1 && this.props.recipientid != this.props.otheruserid && 'Accept'}
                {this.props.status == 2 && 'Unfriend'}
            </button>
            </div>
        )
    }
}
