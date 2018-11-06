import React, { Component } from 'react';
import { Col, Button, Input } from 'react-materialize';
import axios from 'axios';
import qs from 'query-string';

class LoginForm extends Component {
    usernameInput = React.createRef();
    passwordInput = React.createRef();

    handleFormSubmit = event => {
        event.preventDefault();
        const username = this.usernameInput.current.state.value;
        const password = this.passwordInput.current.state.value;

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
            console.log('res.request: ', res.request);
            const userData = qs.parse(res.request.responseURL.split('?')[1]);
            this.props.setCurrentUser(userData);
            this.props.updateLoginState(true);
        })
        .catch(function (error) {
            window.M.toast({html: 'There was an error logging in. Please try again', classes: 'red lighten-1'});            
            // console.log(error);
            // console.log('error.config: ', error.config);
        })
        .then(res => {
            // console.log('but this one always runs??');
        });
    }
    render() {
        return(
            <form onSubmit={this.handleFormSubmit}>
                <Col s={12}>
                    <Input id={"userName"} defaultValue='DannyWobble' ref={this.usernameInput} placeholder="is this even used" s={12} label="Username" />
                </Col>
                <Col s={12}>
                    <Input id={"loginPassword"} defaultValue='123' ref={this.passwordInput} placeholder="is this even used" s={12} label="Password" type="password"/>
                </Col>
                <Col s={12}>
                    <Button waves="light" className="pink lighten-2 right">Login</Button>
                </Col>
            </form>
        )
    }
}

export default LoginForm;