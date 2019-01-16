import React, { Component } from 'react';
import { Col, Button, Input } from 'react-materialize';
import axios from 'axios';
import qs from 'query-string';

class LoginForm extends Component {
    emailInput = React.createRef();
    passwordInput = React.createRef();

    handleFormSubmit = event => {
        event.preventDefault();
        const loginEmail = this.emailInput.current.state.value;
        const password = this.passwordInput.current.state.value;
        console.log('loginEmail: ', loginEmail);
        

        const params = {
            email: loginEmail,
            password: password
        }
        axios.post('/api/users/login', params)
            .then(res => {
                console.log(res);
                window.M.toast({html: 'Login successful', classes: 'green lighten-1'});  
            })
            .catch(error => {
                console.log(error);
                window.M.toast({html: 'There was an error logging in. Please try again', classes: 'red lighten-1'});  
            });
    }
    render() {
        return(
            <form onSubmit={this.handleFormSubmit}>
                <Col s={12}>
                    <Input id={"loginEmail"} defaultValue={'daniel.e.blythe@gmail.com'} ref={this.emailInput} placeholder="Email" s={12} label="Email" />
                </Col>
                <Col s={12}>
                    <Input id={"loginPassword"} defaultValue={'daniel'} ref={this.passwordInput} placeholder="Password" s={12} label="Password" type="password"/>
                </Col>
                <Col s={12}>
                    <Button waves="light" className="pink lighten-2 right">Login</Button>
                </Col>
            </form>
        )
    }
}

export default LoginForm;