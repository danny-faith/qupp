import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-materialize';
import { getAllUsers, clearAllUsers, getMessageRoom, clearMessageRoom } from '../../actions/messengerActions';
import isEmpty from '../../validation/is-empty';
import Users from './Users';
import Messages from './Messages';

class Messenger extends Component {
    state = {
        areWeTalking: false,
        currentRoom: null
    }
    backButtonHandler = () => {
        this.props.clearMessageRoom();
        this.setState({
            areWeTalking: false
        });
    }
    // TODO BUG if there is no messageRoom. You have to click twice on the user to open the room
    componentWillReceiveProps = (props) => {
        if (!isEmpty(props.messenger.messageRoom)) {
            if (this.state.currentRoom !== props.messenger.messageRoom[0]._id) {
                this.setState({
                    areWeTalking: true,
                    currentRoom: props.messenger.messageRoom[0]._id
                }, () => {
                    
                });
            }
        }
    }
    render() {
        return (
            <div>
                {(this.state.areWeTalking) && <Button onClick={this.backButtonHandler}>Back</Button>}
                {(this.state.areWeTalking) ? <Messages /> : <Users />}
            </div>
        )
    }
}

Messenger.propTypes = {
	getAllUsers: PropTypes.func.isRequired,
	clearAllUsers: PropTypes.func.isRequired,
	getMessageRoom: PropTypes.func.isRequired,
	clearMessageRoom: PropTypes.func.isRequired,
	messenger: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	messenger: state.messenger
});

export default connect(mapStateToProps, { getAllUsers, clearAllUsers, getMessageRoom, clearMessageRoom })(Messenger );