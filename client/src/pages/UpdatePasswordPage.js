import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ChangePassword from '../components/auth/ChangePassword';

class ForgotPassword extends Component {
  render() {
    return (
      <Fragment>
		    <h2 className="center">Update password</h2>
        <ChangePassword />        
      </Fragment>
    )
  }
}

ForgotPassword.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ForgotPassword);
