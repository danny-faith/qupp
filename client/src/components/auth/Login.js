import React, { Component } from 'react'
import { Row, Col, Button, Input } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginUser } from '../../actions/authActions';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  }
  onChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }
  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    }
    this.props.loginUser(userData);
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
					<h1 className="center">Login</h1>
					<form noValidate onSubmit={this.onSubmit}>
            <Row>
							<Col s={12}>
								<Input
									id={"email"}
									className={classnames({
										'invalid': errors.email
									})} 
									type="text"
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
								<Button className="btn-small right" waves="light">Login</Button>
							</Col>
						</Row>
          </form>
         </Col>
      </Row>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
