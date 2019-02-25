import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import classnames from 'classnames';
import { createPlaylist } from '../actions/authActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class CreatePlaylist extends Component {
    state = {
        name: '',
        errors: {}
    }
    onSubmit = (e) => {
        e.preventDefault();
        const newPlaylist = {
            name: this.state.name
        }
        this.props.createPlaylist(newPlaylist);
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const errors = this.state;

        return (
            <Row>
                <Col s={12}>
                    <h5>{this.props.title}</h5>
                    <form onSubmit={this.onSubmit}>
                        <Input
                            id={"name"}
                            className={classnames({
                                'invalid': errors.name
                            })} 
                            type="text"
                            name="name"
                            s={12}
                            label="Playlist name"
                            onChange={this.onChange}
                            value={this.state.name}
                        />
                        {/* {errors.name && (<p className="red-text col no-margin">{errors.playlist_name}</p>)} */}
                        <Button className="right">Create playlist</Button>
                    </form>
                </Col>
            </Row>
        )
    }
}

CreatePlaylist.propTypes = {
	createPlaylist: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {createPlaylist })(CreatePlaylist);
