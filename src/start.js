//REACT STUFF
import React from 'react';
import ReactDOM from 'react-dom';
import { Logo } from './logo';
import { Welcome } from './welcome';
import App from './app';

//REDUX STUFF
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducers';
//import other component here
//import { composeWithDevTools } from 'redux-devtools-extension';




const store = createStore(reducer, applyMiddleware(reduxPromise));

let component;
if (location.pathname == '/welcome') {
    console.log(' url is /welcome, so call Welcome component');
    component = <Welcome />
}
else {
    console.log(' url is not /welcome, so in else, call App component');
    component = (
        //pass store as prop to the provider
        <Provider store={store}>
            <App />
            </Provider>
    );
}

//BEFORE REDUX
ReactDOM.render(
    component,
    document.querySelector('main')
);


//later: const socket = io.connect();
