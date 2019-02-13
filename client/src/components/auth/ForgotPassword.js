import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

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
    // this.props.loginUser(userData);
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
    return (
      <div>
        
      </div>
    )
  }
}

ForgotPassword.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});
  
export default connect(mapStateToProps)(ForgotPassword);