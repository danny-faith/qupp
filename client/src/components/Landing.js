import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logo from '../logo-v2.svg';

class Landing extends Component {
  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
        this.props.history.push('/dashboard');
    }
  }
  render() {
    return (
        <div>
            <img alt="qupp logo" src={logo} />
        </div>
    )
  }
}

Landing.propTypes = {
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Landing);