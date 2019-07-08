import React, { Component } from 'react';
import { Row, Col, Button, TextInput } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { changePassword } from '../../actions/authActions';

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
						<TextInput
							id={"password"}
							className={classnames({
								'invalid': errors.password
							})} 
							type="password"
							name="password"
							s={12}
							label="New password"
							onChange={this.onChange}
							value={this.state.password}
							/>
							{errors.password && (<p className="red-text col no-margin">{errors.password}</p>)}
					</Col>
				</Row>
				<Row>
					<Col s={12}>
						<TextInput
							id={"password2"}
							className={classnames({
								'invalid': errors.password2
							})} 
							type="password"
							name="password2"
							s={12}
							label="Confirm new password"
							onChange={this.onChange}
							value={this.state.password2}
							/>
							{errors.password2 && (<p className="red-text col no-margin">{errors.password2}</p>)}
							{errors.verifyPasswordRest && (<p className="red-text col no-margin">{errors.verifyPasswordRest}</p>)}
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