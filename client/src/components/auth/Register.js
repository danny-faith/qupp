import React, { Component } from 'react'
import { Row, Col, Button, Input } from 'react-materialize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import classnames from 'classnames';

class Register extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		password2: '',
		errors: {}
	}
	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}
	onSubmit = e => {
		e.preventDefault();
		const newUser = {
			username: this.state.username,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		}
		this.props.registerUser(newUser, this.props.history);
	}
	componentDidMount = () => {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
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
									value={this.state.username}
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
									value={this.state.email}
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
									value={this.state.password}
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
									value={this.state.password2}
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

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {registerUser })(withRouter(Register));