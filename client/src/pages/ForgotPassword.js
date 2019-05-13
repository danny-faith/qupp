import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ForgotPassword from './auth/ForgotPassword';

class ForgotPasswordPage extends Component {
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
    return (
      <Fragment>
				<h2 className="center">Forgot password?</h2>
        <ForgotPassword />        
      </Fragment>
    )
  }
}

ForgotPasswordPage.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ForgotPasswordPage);
