import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/Navbar';
import Sidenav from './components/layout/Sidenav';
// import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Landing from './components/Landing';
import MyAccountPage from './pages/MyAccountPage';
import ViewAllPlaylists from './pages/ViewAllPlaylists';
import Error404 from './pages/Error404';

import './App.scss';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import QuppListPage from './pages/QuppListPage';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiry date
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    // Logout the user
    store.dispatch(logoutUser);
    // TODO: Clear current profile
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }> 
        <Router>
          <div className="App">
            <Navbar />
            <Sidenav />
              <Route exact path="/" component={Landing} />
              <Route exact path="/playlist/:playlist_id" component={QuppListPage} />
              <div className="container">
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/my-account" component={MyAccountPage} />
                </Switch>
                <Route exact path="/playlists" component={ViewAllPlaylists} />
                <Route exact path="/forgotten-password" component={ForgotPasswordPage} />
                <Route exact path="/reset-password" component={ResetPasswordPage} />
                <Switch>
                  {/* <Route component={Error404} /> */}
                </Switch>
              </div>
            {/* <Footer /> */}
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;