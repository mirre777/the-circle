import axios from 'axios';
//action creator (FUNCTION) => wrap action (RETURN) in it

//ACTION 1: GET ALL FRIENDS (LIST)

export const getFriends = () => {
    return axios.get('/get-friends')
        .then(({data}) => {
            console.log('actions, getFriends, then, data: ', data);
            //check this log
            return {
                type: 'GET_FRIENDS',
                friendlist: data
            }
        });
}

//ACTION 2: REMOVE FRIEND

//david: here does otheruserid come from? PASSED FROM FIRNDLIST AS PARAMETER TO DELETEFRIEND (THERE ID IS THE ID OF THE FRIEND)
//axios route links to the server route, has db query to deletefriend from db
export const deleteFriend = (otheruserid) => {
    return axios.post('/user/' + otheruserid + '/defriend')
        .then(({data}) => {
            return {
                type:'DELETE_FRIEND',
                otheruserid: otheruserid,
                status: undefined
            }
        });
}

//ACTION 3: ACCEPT FRIEND

export const acceptFriend = (otheruserid) => {
    return axios.post('/user/' + otheruserid + '/accept')
        .then(({data}) => {
            return {
                type:'ACCEPT_FRIEND',
                otheruserid: otheruserid,
                status: 2
            }
        });
}

//socket.io stuff here

//1 no catch, or in catch: return an action OR a promise that is resolved with an action
//2 wait until promise is resolved, and then it passes the action (type and friendlist) to the REDUCER
