import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ChangePassword from './auth/ChangePassword';

class ForgotPassword extends Component {
  componentDidMount = () => {
    	
		if (this.props.auth.isAuthenticated) {
				this.props.history.push('/dashboard');
		}
	}
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
	}
  render() {
    return (
      <Row>
				<Col s={6} className="offset-s3">
          <h2 className="center">Reset password</h2>
          <ChangePassword />        
        </Col>
      </Row>
    )
  }
}

ForgotPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ForgotPassword));
