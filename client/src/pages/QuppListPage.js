import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPlaylist } from '../actions/playlistActions';
import base from '../base';

import Header from '../components/common/Header';
import { Row, Col } from 'react-materialize';

import Song from '../components/playlist/Song';

class QuppListPage extends Component {
  // state = {
  //   playlists : {}
  // }
  //   searchResults: ['zhdfh']
    
  // }
  componentDidMount = () => {
    this.ref = base.syncState(`playlists/${this.props.match.params.playlist_id}`, {
      context: this,
      state: 'playlist'
    });
    // console.log(this.state);
    
    // setTimeout(() => {
    //   this.setState({
    //     playlist: {
    //       user: this.props.auth.user.id,
    //       songs: ['song 1', 'song 2', 'baby shark'],
    //       queue: ['queued song 1', 'queued song 2', 'queued song 3']
    //     }
    //   })
    // }, 500);
  }
  render() {
    console.log(this.props.auth);
    
    // console.log(this.props);
    return (
        <Fragment>
          <Header songs={25} username="Danny_wobble" />
          <div className="container">
            <Row>
              <Col s={12} m={6}>
                <h1>qupplist</h1>
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
              </Col>
              <Col s={12} m={6}>
                <h1>queue</h1>
                <Song colour="yellow" />
                <Song colour="yellow" />
                <Song colour="yellow" />
                <Song colour="grey" />
                <Song colour="grey" />

                <h1>search</h1>
                <Song colour="grey" />
                <Song colour="grey" />
                <Song colour="grey" />
                <Song colour="grey" />
              </Col>
            </Row>
          </div>
        </Fragment>
    )
  }
}

QuppListPage.propTypes = {
  getPlaylist: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlists: state.playlist
});

export default connect(mapStateToProps, { getPlaylist })(QuppListPage);