import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export class Registration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }
    setFieldValue(e) {
        this[e.target.name] = e.target.value
    }
    submit(e) {
        e.preventDefault();
        console.log('in axios.post /register, this: ', this);
        axios.post('/register', {
            id: this.id,
            first: this.first,
            last: this.last,
            email: this.email,
            password: this.password,
            favoritecolor: this.favoritecolor
        })
        ///results from server
            .then(({ data }) => {
                if (data.success) {
                    location.replace('/')
                }
                else {
                    this.setState ({
                        error: true
                    })
                }
            }
            )
    }
render() {
    return (
        <div className="formDiv">

            {this.state.error && <div className="errordiv">Something is not right. Check carefully.</div>}
            <input className="input" name="first" placeholder="first" onChange={e => this.setFieldValue(e)} />
            <input className="input" name="last" placeholder="last" onChange={e => this.setFieldValue(e)} />
            <input className="input" name="email" placeholder="email" onChange={e => this.setFieldValue(e)} />
            <input className="input" name="password" placeholder="password" onChange={e => this.setFieldValue(e)} />
            <input className="input" name="favoritecolor" placeholder="favorite color" onChange={e => this.setFieldValue(e)} />
            <input className="input" className="submit-button" type="submit" onClick={e => this.submit(e)}/>

        </div>
    )
}

}
