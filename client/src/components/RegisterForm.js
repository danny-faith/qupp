import React, { Component } from 'react';
import {Row, Col, Button, Input } from 'react-materialize';
import axios from 'axios';

const regex = /[$-/:-?{-~!"^_`\[\]]/g;
// const alpha = /[A-Z:a-z]/g;
// /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

class RegisterForm extends Component {
    username = React.createRef();
    email = React.createRef(); 
    password = React.createRef();
    passwordRepeat = React.createRef();

    handleRegisterForm = event => {
        event.preventDefault();        

        const username = this.username.current.state.value;
        const email = this.email.current.state.value;
        const password = this.password.current.state.value;
        const passwordRepeat = this.passwordRepeat.current.state.value;

        // var found = username.match(regex) || []; // || empty array if nothing matches. Avoids me having to check for undefined or null in the if statement. Probably a better way to do this.
        // if entered username matches one of special characters in the regex then fire relevant Mat'
        // if (found.length > 0) {
        //     return window.M.toast({html: 'Alphanumeric characters only in username', classes: 'red lighten-1'});
        // }
        // Check to see if first password matches second password. ! then return with Mat' message
        // if (password !== passwordRepeat) {
        //     return window.M.toast({html: 'Passwords do not match', classes: 'red lighten-1'});
        // }
        

        // build new user object
        const newUser = {
            username,
            email,
            password,
            passwordRepeat
        }

        axios.post('/api/users/register', newUser)
            .then(function (response) {
                window.M.toast({html: `Username: ${response.data.username} was created`, classes: 'green lighten-1'});
            })
            .catch(err => {
                /**
                 * if error is present, loop through errors in the response and alert them via Mat' Toast
                 * mostly these are username and email already exists
                 */
                // const resData = err.response.data;
                // console.log('resData: ', resData);
                
                // Object.keys(resData).forEach(key => {
                //     window.M.toast({html: `${resData[key]}`, classes: 'red lighten-1'});
                //     console.log(resData[key]);
                // });
            });
    }
    render() {
        return(
            <form onSubmit={this.handleRegisterForm}>
                <Row>
                    <Col s={12}>
                        <Input 
                            id={"username"}
                            validate={true}
                            type="text"
                            ref={this.username}
                            placeholder="Username"
                            s={12}
                            label="Username" 
                            defaultValue="daniel"
                            />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"email"}
                            type="email"
                            ref={this.email}
                            placeholder="Email"
                            s={12}
                            label="Email"
                            defaultValue="daniel.blythe@gmail.com"
                            />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"registerPassword"}
                            type="password"
                            ref={this.password}
                            placeholder="Password"
                            s={12}
                            label="Password"
                            defaultValue="password"
                            />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"passwordRepeat"}
                            type="password"
                            ref={this.passwordRepeat}
                            placeholder="Password"
                            s={12}
                            label="Confirm password"
                            defaultValue="password"
                            />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Button className="btn-small right" waves="light">Register</Button>
                    </Col>
                </Row>
            </form>
        )
    }
}

export default RegisterForm;