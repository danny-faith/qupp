import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import store from './store';
import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layout/Navbar';
import Sidenav from './components/layout/Sidenav';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import ViewAllPlaylists from './pages/ViewAllPlaylists';
import Error404 from './pages/Error404';

import './App.scss';

import Landing from './pages/Landing';
import MyAccountPage from './pages/user/MyAccount';
import ForgotPasswordPage from './pages/user/ForgotPassword';
import ResetPasswordPage from './pages/user/ResetPassword';
import QuppListPage from './pages/QuppList';
import EditQupplistPage from './pages/EditQupplist';

// Check for token
// TODO - move inside componentWillMount to see if it stops flash of comp before it logs you out
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
		store.dispatch(logoutUser());
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
					<Route exact path="/playlist/:slug" component={QuppListPage} />
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
						<Route exact path="/edit-playlist/:slug" component={EditQupplistPage} />
						<Route exact path="not-found" component={Error404} />
					</div>
				</div>
			</Router>
		</Provider>
		);
	}
}

export default App;