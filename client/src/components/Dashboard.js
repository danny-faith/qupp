import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Icon, Input } from 'react-materialize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';


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
    const errors = {};
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Playlists</h2>
        <Row>
          <Col s={12}>
            <h5>No playlists</h5>
            <form>
								<Input
									id={"playlistName"}
									className={classnames({
										// 'invalid': errors.playlist_name
									})} 
									type="text"
									name="playlistName"
									placeholder="Playlist name"
									s={12}
									label="Playlist name"
									onChange={this.onChange}
									// value={this.state.playlist_name}
									/>
									{/* {errors.playlistName && (<p className="red-text col no-margin">{errors.playlist_name}</p>)} */}
              <Button className="right">Create playlist</Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col s={8}>
            <h5>Bugsy's House party</h5>
          </Col>
          <Col s={4}>
            <Button className="right" waves='light'><Icon>visibility</Icon></Button>
            <Button className="right yellow darken-3" waves='light'><Icon>edit</Icon></Button>
          </Col>
          <Col s={8}>
            <h5>xCvcFe45Fbfddy</h5>
          </Col>
          <Col s={4}>
            <Button className="right blue" waves='light'><Icon>file_copy</Icon></Button>
            <Button className="right pink lighten-2" waves='light'><Icon>share</Icon></Button>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col s={8}>
            <h5>23rd Richmon Park Chillin!</h5>
          </Col>
          <Col s={4}>
            <Button className="right" waves='light'><Icon>visibility</Icon></Button>
            <Button className="right yellow darken-3" waves='light'><Icon>edit</Icon></Button>
          </Col>
          <Col s={8}>
            <h5>No share link created</h5>
          </Col>
          <Col s={4}>
            <Button className="right blue disabled" waves='light'><Icon>file_copy</Icon></Button>
            <Button className="right pink lighten-2" waves='light'><Icon>share</Icon></Button>
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
