import React, { Component } from 'react'
import {Row, Col, Button, Input } from 'react-materialize';
import axios from 'axios';

export default class Register extends Component {
	state = {
		username: 'Daniel',
		email: 'daniel.e.blythe@gmail.com',
		password: 'daniel',
		password2: 'daniel',
		errors: {}
	}
	onSubmit = e => {
		e.preventDefault();
		const newUser = {
			username: this.state.username,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		}
		console.log(newUser);
		axios.post('/api/users/register', newUser)
			.then(user => console.log(user))
			.catch(err => console.log(err));
	}
	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}
	render() {
		return (
			<Row>
				<Col s={6} className="offset-s3">
					<h1 className="center">Register</h1>
					<form noValidate onSubmit={this.onSubmit}>
						<Row>
							<Col s={12}>
								<Input
									id={"username"}
									type="text"
									name="username"
									placeholder="Username"
									s={12}
									label="Username"
									onChange={this.onChange}
									defaultValue={this.state.username}
									/>
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Input
									id={"email"}
									type="email"
									name="email"
									placeholder="Email"
									s={12}
									label="Email"
									onChange={this.onChange}
									defaultValue={this.state.email}
									/>
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Input
									id={"password"}
									type="password"
									name="password"
									placeholder="Password"
									s={12}
									label="Password"
									onChange={this.onChange}
									defaultValue={this.state.password}
									/>
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Input
									id={"password2"}
									type="password"
									name="password2"
									placeholder="Confirm password"
									s={12}
									label="Confirm password"
									onChange={this.onChange}
									defaultValue={this.state.password2}
									/>
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Button className="btn-small right" waves="light">Register</Button>
							</Col>
						</Row>
					</form>
				</Col>
			</Row>
			)
		}
}
