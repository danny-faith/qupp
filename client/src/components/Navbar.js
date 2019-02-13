import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from './../actions/authActions';
import { withRouter } from 'react-router-dom';

import logo from '../logo-v2.svg';

class Navbar extends Component {
    userRef = React.createRef();

    onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser(this.props.history);
    }
    componentDidMount() {
        window.M.Dropdown.init(this.userRef.current);
    }
    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul id="nav-mobile" className="right hide-on-small-and-down">
                <li>
                    <a href="#" onClick={this.onLogoutClick}>Logout</a>
                </li>
                <li className="avatar">
                    <a ref={this.userRef} data-target="dropdown1" className="dropdown-trigger">
                        {/* <img src={user.avatar} />  */}
                        {user.name}
                    </a>
                    <ul id="dropdown1" className="dropdown-content">
                        <li><a href="#!">Profile</a></li>
                        <li><a href="#!">two</a></li>
                        <li className="divider"></li>
                        <li><a href="#!">three</a></li>
                    </ul>
                </li>
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
                <Link to="/" className="brand-logo">
                    <img width="90" alt="qupp logo" src={logo} />
                </Link>
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

export default connect(mapStateToProps, { logoutUser })(withRouter(Navbar));