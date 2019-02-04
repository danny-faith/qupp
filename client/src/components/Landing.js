import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../logo-v2.svg';

export default class Landing extends Component {
  render() {
    return (
        <div>
            <img alt="qupp logo" src={logo} />
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </div>
    )
  }
}
