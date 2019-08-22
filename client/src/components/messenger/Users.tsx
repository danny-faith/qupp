import React, { useEffect, Suspense } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	getAllUsers,
	clearAllUsers,
	getMessageRoom
} from '../../actions/messengerActions';
import { Button, Row, Col } from 'react-materialize';
import isEmpty from '../../validation/is-empty';
import Spinner from '../common/Spinner';
import classNames from 'classnames';

interface IUsersProps {
	getAllUsers: () => void;
	getMessageRoom: (arg0: any) => void;
	messenger: { loading: any; users: any };
	auth: { user: { id: any } };
}

const Users = (props: IUsersProps) => {
	useEffect(() => {
		props.getAllUsers();
	}, []);

	const userClick = (e: {
		preventDefault: () => void;
		target: { dataset: { secondaryUserId: any } };
	}) => {
		e.preventDefault();
		props.getMessageRoom(e.target.dataset.secondaryUserId);
	};
	const loading = props.messenger.loading;
	const users = props.messenger.users;

	let userContent;

	if (loading) {
		userContent = <Spinner />;
	} else if (isEmpty(users)) {
		userContent = 'No users to talk to :(';
	} else {
		userContent = users
			.filter((user: { _id: string }) => props.auth.user.id !== user._id)
			.map((user: { _id: string; online: boolean; username: string }) => (
				<Row key={user._id}>
					<Col>
						<Button
							onClick={userClick}
							data-secondary-user-id={user._id}
							className={classNames('bg-grey', {
								'bg-green': user.online
							})}
							waves="light"
						>
							{user.username}
						</Button>
					</Col>
				</Row>
			));
	}
	return <div>{userContent}</div>;
};

Users.propTypes = {
	getAllUsers: PropTypes.func.isRequired,
	clearAllUsers: PropTypes.func.isRequired,
	getMessageRoom: PropTypes.func.isRequired,
	messenger: PropTypes.object,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state: { auth: any; messenger: any }) => ({
	auth: state.auth,
	messenger: state.messenger
});

export default connect(
	mapStateToProps,
	{ getAllUsers, clearAllUsers, getMessageRoom }
)(Users);
