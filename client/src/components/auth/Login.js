import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
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
					<h2 className="center">Login</h2>
					<form noValidate onSubmit={this.onSubmit}>
						<Row>
							<TextFieldGroup
								placeholder="Email address"
								name="email"
								type="email"
								value={this.state.email}
								onChange={this.onChange}
								error={errors.email}
              />
							<TextFieldGroup
								placeholder="Password"
								name="password"
								type="password"
								value={this.state.password}
								onChange={this.onChange}
								error={errors.password}
							/>
							<Col s={12}>
								<Link className='col s12' to="/forgotten-password">Forgotten password?</Link>
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
