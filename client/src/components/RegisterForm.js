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
        console.log('username: ', username);
        

        var found = username.match(regex) || []; // || empty array if nothing matches. Avoids me having to check for undefined or nu;; in the if statement. Probably a better way to do this.
        if (found.length > 0) {
            return window.M.toast({html: 'Alphanumeric characters only in username', classes: 'red lighten-1'});            
        }
        // Check to see if first password matches second password. ! then return with Mat' message
        if (password !== passwordRepeat) {
            return window.M.toast({html: 'Passwords do not match', classes: 'red lighten-1'});
        }

        const newUser = {
            username,
            email,
            password
        }

        axios.post('http://localhost:8080/users/', newUser)
            .then(function (response) {
                console.log(response);
                console.log(response.status); // this doesn't run on success as there are no errors           
                if (response.status !== 201) {
                    console.log('new user not successful');
                    const resData = response.data.errors;
                    Object.keys(resData).forEach(key => {
                        window.M.toast({html: `${resData[key].path} ${resData[key].message}`, classes: 'red lighten-1'});
                    });
                } else {
                    console.log('new user created as it was 201');
                    window.M.toast({html: `Username: ${response.data.username} was created`, classes: 'green lighten-1'});
                }
                
                // if errors set colour else blue or something
                
                // console.log(Object.keys(resData).forEach(key => {
                //     window.M.toast({html: `${resData[key].path} ${resData[key].message}`, classes: 'red lighten-1'});
                // }));
            })
            .catch(function (err) {
                // UPDATE: basically its always a success. Andif I try and send an error status I cannot send any of the data that I can use for messages and reasons like username already taken

                // as I dont send a status in server.js, axios doesnt realise theres an error and so it doesn get caught by the catch.
                // add status back in and figure out why you cant send a status and the err object `.status(400).send(err)` <- cant do that
                // UPDATE: this .catch() function is running(as well as the above .then() which I believe should only run on success, then .catch() shouldn't run) even though a user is created. I'm guessing its as I'm not sending the right status' from express
                // console.log('.catch in axios: ', err);

                // window.M.toast({html: 'Error, please try registration again', classes: 'red lighten-1'});
            })
            .then(function (response) {
                // console.log('always run', response);
                // window.M.toast({html: 'response.data', classes: 'red lighten-1'});
            });
    }
    render() {
        return(
            <form onSubmit={this.handleRegisterForm}>
                <Row>
                    <Col s={12}>
                        <Input 
                            id={"username"}
                            defaultValue="DannyWobble"
                            validate={true}
                            type="text"
                            required
                            ref={this.username}
                            placeholder="Username"
                            s={12}
                            label="Username" />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"email"}
                            defaultValue="daniel.e.blythe@gmail.com"
                            type="email"
                            required
                            ref={this.email}
                            placeholder="Email"
                            s={12}
                            label="Email" />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"registerPassword"}
                            defaultValue="ggg"
                            type="password"
                            required
                            ref={this.password}
                            placeholder="Password"
                            s={12}
                            label="Password" />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"registerPasswordRepeat"}
                            defaultValue="ggg"
                            type="password"
                            required
                            ref={this.passwordRepeat}
                            placeholder="Password"
                            s={12}
                            label="Repeat password" />
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