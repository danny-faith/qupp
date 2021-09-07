import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { Button } from "react-materialize"
import { clearMessageRoom } from "../../actions/messengerActions"
import isEmpty from "../../validation/is-empty"
import Users from "./Users"
import Messages from "./Messages"

export function Messenger(props) {
	const backButtonHandler = () => {
		props.clearMessageRoom()
	}

	return (
		<div>
			{!isEmpty(props.messenger.messageRoom) && (
				<Button onClick={backButtonHandler}>Back</Button>
			)}
			{!isEmpty(props.messenger.messageRoom) ? <Messages /> : <Users />}
		</div>
	)
}

Messenger.propTypes = {
	clearMessageRoom: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	messenger: state.messenger,
})

export default connect(mapStateToProps, { clearMessageRoom })(Messenger)
