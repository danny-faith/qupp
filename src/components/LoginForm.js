import React, { Component } from 'react';
import { Col, Button, Input } from 'react-materialize';
import axios from 'axios';

class LoginForm extends Component {
    usernameInput = React.createRef();
    passwordInput = React.createRef();

    handleFormSubmit = event => {
        event.preventDefault();
        const username = this.usernameInput.current.state.value;
        const password = this.passwordInput.current.state.value;

        // console.log('username: ', username);
        // console.log('password: ', password);
        const params = {
            username: username,
            password: password
        }
        // const setCurrentUser = this.props.setCurrentUser;
        axios({
            method: 'post',
            url: 'http://localhost:8080/login',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: params
        })
        .then(res => {
          console.log('res: ', res);
          console.log('only runs when login successful??');
          this.props.setCurrentUser({username: 'Bucky O\'Hare', avatar: 'http://www.honcho-sfx.com/blog/wp-content/uploads/2016/11/Bucky-OHare-toys-300x300.jpg'});
        // console.log(this.props);
        
          // success!
          // SHOULD BE ERROR CATCHING IN HERE!!!
        })
        .catch(function (error) {
            console.log('error: ', error);
            console.log('error.config: ', error.config);
        })
        .then(res => {
            // console.log('but this one always runs??');
        });
    }
    render() {
        return(
            <form onSubmit={this.handleFormSubmit}>
                <Col s={12}>
                    <Input id={"userName"} defaultValue='daniel8' ref={this.usernameInput} placeholder="is this even used" s={12} label="Username" />
                </Col>
                <Col s={12}>
                    <Input id={"loginPassword"} defaultValue='password' ref={this.passwordInput} placeholder="is this even used" s={12} label="Password" />
                </Col>
                <Col s={12}>
                    <Button waves="light" className="pink lighten-2 right">Login</Button>
                </Col>
            </form>
        )
    }
}

export default LoginForm;