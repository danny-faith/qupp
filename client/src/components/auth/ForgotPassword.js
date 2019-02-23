import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { forgotPasswordEmailSearch } from '../../actions/authActions';

class ForgotPassword extends Component {
    state = {
        email: '',
        errors: {}
    }
    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }
    onSubmit = e => {
        e.preventDefault();

        const userData = {
            email: this.state.email
        }

        this.props.forgotPasswordEmailSearch(userData);
        // Add state = { emailSent: false }
        // TODO if emailSent state == true then clear errors and clear email input 
        // TODO update success message to be in form of form validation
    }

  render() {
	const { errors } = this.state;
    return (
		<Row>
			<Col s={6} className="offset-s3">
				<form noValidate onSubmit={this.onSubmit}>
					<Row>
						<Col s={12}>
							<Input
							id={"email"}
							className={classnames({
							'invalid': errors.email
							})} 
							type="email"
							name="email"
							s={12}
							label="Email address"
							onChange={this.onChange}
							value={this.state.email}
							/>
							{errors.email && (<p className="red-text col no-margin">{errors.email}</p>)}
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

ForgotPassword.propTypes = {
    forgotPasswordEmailSearch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});
  
export default connect(mapStateToProps, { forgotPasswordEmailSearch })(ForgotPassword);