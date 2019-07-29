import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers, clearAllUsers, getMessageRoom } from '../../actions/messengerActions';
import { Button, Row, Col } from 'react-materialize';
import isEmpty from '../../validation/is-empty';
import Spinner from '../common/Spinner';

class Users extends Component {
    componentDidMount = () => {
        this.props.getAllUsers();
    }
    userClick = (e) => {
        e.preventDefault();
        // const instance = window.M.Modal.getInstance(this.props.usersRef.current.instance.el);
        // instance.close();
        
        this.props.getMessageRoom(e.target.dataset.secondaryUserId);
    }
    render() {
        const loading = this.props.messenger.loading;
		const users = this.props.messenger.users;
        
        let userContent;

        if (loading) {
            userContent = <Spinner />;
        } else if (isEmpty(users)) {
            userContent = 'No users to talk to :(';
        } else {
            userContent = users.filter(user => this.props.auth.user.id !== user._id).map(user => (
                <Row key={user._id}>
                    <Col><Button onClick={this.userClick} data-secondary-user-id={user._id} className="bg-green" waves="light">{user.username}</Button></Col>
                </Row>
            ));
        }
        return (
            <div>
                {userContent}
            </div>
        )
    }
}

Users.propTypes = {
	getAllUsers: PropTypes.func.isRequired,
	clearAllUsers: PropTypes.func.isRequired,
	getMessageRoom: PropTypes.func.isRequired,
	messenger: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	messenger: state.messenger
});

export default connect(mapStateToProps, { getAllUsers, clearAllUsers, getMessageRoom })(Users);