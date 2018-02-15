import React from 'react';
import App from './app';
import {Link} from 'react-router-dom';
import {getFriends} from './actions';
//deleteFriend and acceptFriendreq too
import {connect} from 'react-redux';

export class Friendlist extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if(!this.props.getFriends) {
            console.log(
            );
            this.props.getFriends();
        }
        else {
            console.log();
            this.props.getFriends();
        }
    }

    render() {
        const {friends, pending, getFriends} = this.props;
        console.log('friendlist, this.props: ', this.props);
        //onclick dispatch action

//NO FRIENDS

        if (!friends) {
            return null;
        }

//ACCEPTED FRIENDS

        let acceptedFriends = friends.map(friend => {
            let {id, first, last, picture} = friend;
            return (
                <div key={id} className="friends">
                <Link to={`/user/${id}`}>
                    <p>{first} {last}</p>
                    <img src={picture} className="profilepic"/>
                </Link>
                <button className="remove-accept-friend-button" onClick={() => deleteFriend(id)}>Out of my life</button>
                </div>
            )
        })

//PENDING FRIENDS

        let pendingFriends = pending.map(pending => {
            let {id, first, last, picture} = pending;
            return (
                <div key={id} className="friends">
                <Link to={`/user/${id}`}>
                    <p>{first} {last}</p>
                    <img src={picture} className="profilepic"/>
                </Link>
                <button className="remove-accept-friend-button" onClick={() => acceptFriend(id)}>Out of my life</button>
                <button className="remove-accept-friend-button" onClick={() => deleteFriend(id)}>Welcome friend</button>
                </div>
            )
        })

//WHAT USER SEES

        return (
            <div className="friendsection">
                <div className="friends">
                    <div>{pendingFriends}</div>
                </div>
                <div className="pending">
                    <div>{acceptedFriends}</div>
                </div>
            </div>
        )
    }
}




//connects store STATE to the props
//runs again when friends or pending change
const mapStateToProps = function(state) {
    console.log('state: ', state);
    return {
        friends: state.friends && state.friends.filter(friend => friend.status == 2),
        pending: state.friends && state.friends.filter(friend => friend.status == 1)

    }
}
//connects Redux ACTIONS of actioncreators to React props
const mapDispatchToProps = function(dispatch) {
    return {
        getFriends: () => dispatch(getFriends()),
        acceptFriend: (otheruserid) => dispatch(acceptFriend(otheruserid)),
        deleteFriend: (otheruserid) => dispatch(deleteFriend(otheruserid))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Friendlist);
//connect is method that will wrap friendlist/component in another component - that component is directly connected to the redux store.
//map 2x are passed as props to the component/friendlist
//wrapper connected to the redux store (freidnlist is wrapped in it, so it will be automaticlly with the new state of the store)
