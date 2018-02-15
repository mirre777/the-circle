//Takes 2 parameters: current state and action.
export default function (state = {}, action) {

//GET FRIEND LIST

    if (action.type  == 'GET_FRIENDS') {
        return Object.assign({}, state, {
            friendlist: action.friendlist
        })
    }

//DELETE FRIEND

    if (action.type  == 'DELETE_FRIEND') {
        return Object.assign({}, state, {
            friendlist: state.friends.map(friend => {
                //map through friends
                //and return all ids except for the frIend id in action (the delete action)
                //and store in friends
                return friend.id !== action.friend.id
            })
        })
    }

//ACCEPT FRIEND

    if (action.type  == 'ACCEPT_FRIEND') {
        return Object.assign({}, state, {
            friendlist: state.friends.map(friend => {
                if (action.friend.id == friend.id) {
                    return Object.assign({}, friend, {
                        status: action.status
                    })
                }
                return friend
            })
        })
    }

//tste things up or if the action does not match any of these actions

    return state;
}
//this accepted friend id is this friend id
//ststaus changed, so re-render and the one with the changed status will be categorised in the right group
//clone the object state (2 arguments => clone)
//clone space {}, add state (and add 2 to 1), then 3 to 2 (if there is a third argument)

//new array of friends. except for one clicked: one clicked status changed: once state changes, mapstatetoprops will run again
