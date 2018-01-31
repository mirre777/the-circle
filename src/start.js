import React from 'react';
import ReactDOM from 'react-dom';
import { Logo } from '../logo';
import { Welcome } from '../welcome';

//registration or logo? Logged inor not
let component;
if (location.pathname == '/welcome') {
    console.log(' url is /welcome, so call Welcome');
    component = <Welcome />
}
else {
    console.log(' url is not /welcome, so in else');
    component = <Logo />
}
console.log(component);

ReactDOM.render(
    component,
    document.querySelector('main')
);


//example
// function HelloWorld() {
//     return (
//         <div>Hello, World!</div>
//     );
// }

//register: submit data through axios
//session.loggedIn
//success: see page with logo
//not successfull: registration page
