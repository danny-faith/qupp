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
        
        axios({
            method: 'post',
            url: 'http://localhost:8080/login',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: params
        })
        .then(res => {
            /**
             * extract user data out of the response send back from the login route/endpoint
             */
            const userData = qs.parse(res.request.responseURL.split('?')[1]);
            this.props.setCurrentUser(userData); // Set the current user to the user who logged in using the previosuly created `userData` object
            this.props.updateLoginState(true); // set login state to true so React renders the <App />
        })
        .catch(function (error) {
            /**
             * Not a great error. This will need to be imporved to give specifics
             * Use this but with data sent back from login.route.js.
             * Similar to RegisterForm.js when adding a new User
             * const resData = error.response.data.errors;
             */
            window.M.toast({html: 'There was an error logging in. Please try again', classes: 'red lighten-1'});            
        });
    }
    render() {
        return(
            <form onSubmit={this.handleFormSubmit}>
                <Col s={12}>
                    <Input id={"userName"} ref={this.usernameInput} placeholder="Username" s={12} label="Username" />
                </Col>
                <Col s={12}>
                    <Input id={"loginPassword"} ref={this.passwordInput} placeholder="Password" s={12} label="Password" type="password"/>
                </Col>
                <Col s={12}>
                    <Button waves="light" className="pink lighten-2 right">Login</Button>
                </Col>
            </form>
        )
    }
}

export default LoginForm;