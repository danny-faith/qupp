import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from './../actions/authActions';

class Navbar extends Component {
    onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	}
    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul id="nav-mobile" className="right hide-on-small-and-down">
                <li><a href="#" onClick={this.onLogoutClick}>Logout</a></li>
            </ul>
        );

        const guestLinks = (
            <ul id="nav-mobile" className="right hide-on-small-and-down">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        );

        return (
            <nav>
                <div className="nav-wrapper">
                <Link to="/" className="brand-logo">Logo</Link>
                {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        )
    }
}

Navbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navbar);