import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changePassword } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class ChangePassword extends Component {
	state = {
		password: '',
		password2: '',
		errors: {}
	}
	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}
  	onSubmit = e => {
    	e.preventDefault();
		console.log(this.props);
	
		const payload = {
			isAuthenticated: this.props.auth.isAuthenticated,
			token: this.props.location.search.replace('?', '').split('=')[1],
			userId: this.props.auth.user.id,
			password: this.state.password,
			password2: this.state.password2
		}
    	this.props.changePassword(payload);
	}
	componentWillReceiveProps = (nextProps) => {
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
	}
  	render() {
		const { errors } = this.state;

		return (
			<form noValidate onSubmit={this.onSubmit}>
				<Row>
					<Col s={12}>
						<TextFieldGroup
							placeholder="New password"
							name="password"
							type="password"
							value={this.state.password}
							onChange={this.onChange}
							error={errors.password}
						/>
					</Col>
				</Row>
				<Row>
					<Col s={12}>
						<TextFieldGroup
							placeholder="Confirm new password"
							name="password2"
							type="password"
							value={this.state.password2}
							onChange={this.onChange}
							error={errors.password2}
						/>
					</Col>
				</Row>
				<Row>
					<Col s={12}>
						<Button className="btn-small right" waves="light">Update password</Button>
					</Col>
				</Row>
			</form>
		)
  	}
}

ChangePassword.propTypes = {
	changePassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps,  { changePassword })(withRouter(ChangePassword));