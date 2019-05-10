import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from './../actions/authActions';
import { clearPlaylists } from './../actions/playlistActions';
import { withRouter } from 'react-router-dom';

import logo from '../logo-v2.svg';

class Navbar extends Component {
    userRef = React.createRef();

    state = {
        isAuthenticated2: false
    }

    onLogoutClick = (e) => {
		e.preventDefault();
		this.props.clearPlaylists();
		this.props.logoutUser(this.props.history);
    }
    componentDidMount = () => {
        // console.log('Navbar componentDidMount');
        
        // if (this.state.isAuthenticated2) {
        //     window.M.Dropdown.init(this.userRef.current);
        // }
        // document.addEventListener('DOMContentLoaded', function() {
        //     var elems = document.querySelectorAll('.sidenav');
        //     var instances = M.Sidenav.init(elems, options);
        //   });
        window.M.Dropdown.init(this.userRef.current);
    }
    componentWillReceiveProps = (nextProps) => {
        // console.log(nextProps);
        
        if (nextProps.auth.isAuthenticated) {
            console.log('there are authenticated');
            // this.setState({
            //     isAuthenticated2: true
            // });
            window.M.Dropdown.init(this.userRef.current);
            
        } else {
            console.log('there are not authenticated');
            // window.M.Dropdown.init(this.userRef.current);
        }
    }
    // componentWillUpdate = () => {
    //     // console.log('componentWillUpdate');
    //     if (this.state.isAuthenticated2) {
    //         // console.log('hello?');
            
    //         window.M.Dropdown.init(this.userRef.current);
    //     } else {
    //         // console.log('me?');
            
    //     }
    // }
    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                    <a href="!#" onClick={this.onLogoutClick}>Logout</a>
                </li>
                <li className="avatar">
                    <a href="!#" ref={this.userRef} data-target="dropdown1" className="dropdown-trigger">
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
            <nav>
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