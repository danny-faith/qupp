import React, { Component } from 'react'

export default class Sidenav extends Component {
  sideNavRef = React.createRef();
  componentDidMount = () => {
    window.M.Sidenav.init(this.sideNavRef.current);

  }
  render() {
    return (
        <ul ref={this.sideNavRef} className="sidenav" id="sidenav">
            <li><a href="sass.html">Sass</a></li>
            <li><a href="badges.html">Components</a></li>
            <li><a href="collapsible.html">Javascript</a></li>
            <li><a href="mobile.html">Mobile</a></li>
        </ul>
    )
  }
}
