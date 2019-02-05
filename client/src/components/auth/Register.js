import React, { Component } from 'react'
import {Row, Col, Button, Input } from 'react-materialize';
import axios from 'axios';
import classnames from 'classnames';

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
			.catch(err => this.setState({ errors: err.response.data}));
	}
	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}
	render() {
		const { errors } = this.state;
		return (
			<Row>
				<Col s={6} className="offset-s3">
					<h1 className="center">Register</h1>
					<form noValidate onSubmit={this.onSubmit}>
						<Row>
							<Col s={12}>
								<Input
									id={"username"}
									className={classnames({
										'invalid': errors.username
									})} 
									type="text"
									name="username"
									placeholder="Username"
									s={12}
									label="Username"
									onChange={this.onChange}
									defaultValue={this.state.username}
									/>
									{errors.username && (<p className="red-text col no-margin">{errors.username}</p>)}
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Input
									id={"email"}
									className={classnames({
										'invalid': errors.email
									})} 
									type="email"
									name="email"
									placeholder="Email"
									s={12}
									label="Email"
									onChange={this.onChange}
									defaultValue={this.state.email}
									/>
									{errors.email && (<p className="red-text col no-margin">{errors.email}</p>)}
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Input
									id={"password"}
									className={classnames({
										'invalid': errors.password
									})} 
									type="password"
									name="password"
									placeholder="Password"
									s={12}
									label="Password"
									onChange={this.onChange}
									defaultValue={this.state.password}
									/>
									{errors.password && (<p className="red-text col no-margin">{errors.password}</p>)}
							</Col>
						</Row>
						<Row>
							<Col s={12}>
								<Input
									id={"password2"}
									className={classnames({
										'invalid': errors.password2
									})} 
									type="password"
									name="password2"
									placeholder="Confirm password"
									s={12}
									label="Confirm password"
									onChange={this.onChange}
									defaultValue={this.state.password2}
									/>
									{errors.password2 && (<p className="red-text col no-margin">{errors.password2}</p>)}
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
