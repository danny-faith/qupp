import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Icon } from 'react-materialize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {
  componentDidMount = () => {
    if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
    }
  }
  componentWillReceiveProps = (nextProps) => {
      if (!nextProps.auth.isAuthenticated) {
          this.props.history.push('/login');
      }
      if (nextProps.errors) {
          this.setState({errors: nextProps.errors});
      }
  }
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Playlists</h2>
        <Row>
          <Col s={8}>
            <h5>Playlist name</h5>
          </Col>
          <Col s={4}>
            <Button className="yellow darken-3" waves='light'><Icon>edit</Icon></Button>
            <Button waves='light'><Icon>visibility</Icon></Button>
          </Col>
          <Col s={8}>
            <h5>xCvcFe45Fbfddy</h5>
          </Col>
          <Col s={4}>
            <Button className="blue" waves='light'><Icon>file_copy</Icon></Button>
            <Button className="pink lighten-2" waves='light'><Icon>share</Icon></Button>
          </Col>
        </Row>
        <hr></hr>
      </div>
    )
  }
}

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps)(withRouter(Dashboard));
