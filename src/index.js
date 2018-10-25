import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './index.css';
import App from './App';
import Login from './Login';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

const loggedIn = false;



ReactDOM.render(
    <Router>
      <div>  
        <Route exact path="/" render={() => (
            loggedIn ? (
                <App />
            ) : (
                <Redirect to="/login"/>
            )
            )}/>
        <Route path="/login" component={Login} />
      </div>
    </Router>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
