import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';


class Dashboard extends Component {
  componentDidMount = () => {
    if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
    }
  }
  componentWillReceiveProps = (nextProps) => {
      if (!nextProps.auth.isAuthenticated) {
          this.props.history.push('/login');
      }
      if (nextProps.errors) {
          this.setState({errors: nextProps.errors});
      }
  }
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    )
  }
}

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps)(withRouter(Dashboard));
