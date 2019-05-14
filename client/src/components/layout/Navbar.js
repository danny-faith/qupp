import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearPlaylists } from '../../actions/playlistActions';
import { withRouter } from 'react-router-dom';

import logo from '../../logo-v2.svg';

class Navbar extends Component {
    dropdownTriggerRef = React.createRef();
    shouldDropdownInit() {
        console.log('shouldDropdownInit()');
        console.log(this.props.auth.isAuthenticated);
        console.log(this.dropdownTriggerRef.current);
        
        if (this.props.auth.isAuthenticated) {
            window.M.Dropdown.init(this.dropdownTriggerRef.current);
        }
    }
    onLogoutClick = (e) => {
		e.preventDefault();
		this.props.clearPlaylists();
		this.props.logoutUser(this.props.history);
    }
    componentDidMount = () => {
        this.shouldDropdownInit();
    }
    componentDidUpdate = () => {
        this.shouldDropdownInit();
    }
    render() {        
        const { isAuthenticated, user } = this.props.auth;
            
        const authLinks = (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                    <a href="!#" onClick={this.onLogoutClick}>Logout</a>
                </li>
                <li className="avatar">
                    <a href="#" ref={this.dropdownTriggerRef} data-target="dropdown1" className="dropdown-trigger">
                        <div className="avatar" style={{ backgroundImage: `url(${user.avatar})`}}>
                        </div>
                        {user.username}
                    </a>
                    <ul id="dropdown1" className="dropdown-content">
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/my-account">Account</Link></li>
                        <li className="divider"></li>
                        <li><a href="!#" onClick={this.onLogoutClick}>Logout</a></li>
                    </ul>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        );

        return (
            <nav ref={this.navRef}>
                <div className="nav-wrapper">
                <Link to="/" className="brand-logo">
                    <img width="90" alt="qupp logo" src={logo} />
                </Link>
                <a href="!#" data-target="sidenav" className="sidenav-trigger">
                    <i className="material-icons">menu</i>
                </a>
                {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        )
    }
}

Navbar.propTypes = {
	clearPlaylists: PropTypes.func.isRequired,
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearPlaylists })(withRouter(Navbar));