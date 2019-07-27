import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Modal } from 'react-materialize';
import Messenger from '../messenger/Messenger';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearPlaylists } from '../../actions/playlistActions';
import { withRouter } from 'react-router-dom';

class Sidenav extends Component {
  messengerRef = React.createRef();
  sideNavRef = React.createRef();
  state = {
    isAuthenticated2: false
  }
  componentDidMount = () => {
    window.M.Sidenav.init(this.sideNavRef.current);

  }
  onLogoutClick = (e) => {
		e.preventDefault();
		this.props.clearPlaylists();
		this.props.logoutUser(this.props.history);
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
        <ul ref={this.sideNavRef} className="sidenav" id="sidenav">
          <li>
          <div className="user-view">
            <div className="background">
              <img alt="background for user" src="img/office.jpg" />
            </div>
            <a href="#user">
              <div className="avatar" style={{ backgroundImage: `url(${user.avatar})`}}>
              </div>
            </a>
            <a href="#name"><span className="white-text name pb-4">{user.username}</span></a>
            </div>
          </li>

          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/my-account">Account</Link></li>
          <li>
            <Modal id="messengerUsers" className="bg-grey-darkest" header="Messengerrr" ref={this.usersRef} trigger={<a ref={this.messengerRef} href="!#" onClick={this.messengerClick}>Messenger</a>}>
                <Messenger />
            </Modal>
          </li>
          <li className="divider"></li>
          <li><button onClick={this.onLogoutClick}>Logout</button></li>
        </ul>
    );

    const guestLinks = (
        <ul ref={this.sideNavRef} className="sidenav" id="sidenav">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
        </ul>
    );

    return (
      <React.Fragment>
        {isAuthenticated ? authLinks : guestLinks}
      </React.Fragment>
    )
  }
}

Sidenav.propTypes = {
	clearPlaylists: PropTypes.func.isRequired,
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearPlaylists })(withRouter(Sidenav));