import React, { Component } from 'react'
import { Row, Col, Button } from 'react-materialize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../../components/common/TextFieldGroup';

export class Register extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		password2: '',
		errors: {}
	}
	onChange = e => {
		const errors = this.state.errors;
		errors[e.target.name] = '';
		this.setState({
			[e.target.name]: e.target.value,
			errors
		});
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
							<TextFieldGroup
								name="email"
								type="email"
								label="Email"
								value={this.state.email}
								onChange={this.onChange}
								error={errors.email}
              				/>
							<TextFieldGroup
								name="username"
								label="Username"
								value={this.state.username}
								onChange={this.onChange}
								error={errors.username}
              				/>
							<TextFieldGroup
								name="password"
								type="password"
								label="Password"
								value={this.state.password}
								onChange={this.onChange}
								error={errors.password}
              				/>
							<TextFieldGroup
								name="password2"
								type="password"
								label="Confirm password"
								value={this.state.password2}
								onChange={this.onChange}
								error={errors.password2}
              				/>
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