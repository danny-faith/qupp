import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { updatePassword } from '../../actions/authActions';

class PasswordReset extends Component {
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

		const payload = {
			token: this.props.location.search.replace('?', '').split('=')[1],
			password: this.state.password,
			password2: this.state.password2
		}
    this.props.updatePassword(payload);
	}
	componentDidMount = () => {		
		if (this.props.auth.isAuthenticated) {
				this.props.history.push('/dashboard');
		}
	}
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
	}
  render() {
		const { errors } = this.state;

    return (
      <Row>
				<Col s={6} className="offset-s3">
					<h2 className="center">Reset password</h2>
					<form noValidate onSubmit={this.onSubmit}>
            <Row>
							<Col s={12}>
								<Input
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
								<Input
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
							</Col>
						</Row>
            <Row>
							<Col s={12}>
								<Button className="btn-small right" waves="light">Login</Button>
							</Col>
						</Row>
          </form>
         </Col>
      </Row>
    )
  }
}

PasswordReset.propTypes = {
	updatePassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps,  { updatePassword })(PasswordReset);