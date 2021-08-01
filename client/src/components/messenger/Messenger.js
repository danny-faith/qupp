import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from 'react-materialize'
import { getAllUsers, clearAllUsers, getMessageRoom, clearMessageRoom } from '../../actions/messengerActions'
import isEmpty from '../../validation/is-empty'
import Users from './Users'
import Messages from './Messages'

export function Messenger(props) {
    const [areWeTalking, setAreWeTalking] = useState(false)
    const [currentRoom, setCurrentRoom] = useState(null)
    
    const backButtonHandler = () => {
        props.clearMessageRoom()
        setAreWeTalking(false)
    }

    // TODO BUG if there is no messageRoom. You have to click twice on the user to open the room
    useMemo(() => {
        if (!isEmpty(props.messenger.messageRoom)) {
            if (currentRoom !== props.messenger.messageRoom._id) {
                setAreWeTalking(true)
                setCurrentRoom(props.messenger.messageRoom._id)
            }
        }
    })
    
    return (
        <div>
            {(areWeTalking) && <Button onClick={backButtonHandler}>Back</Button>}
            {(areWeTalking) ? <Messages /> : <Users />}
        </div>
    )
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
})

export default connect(mapStateToProps, { getAllUsers, clearAllUsers, getMessageRoom, clearMessageRoom })(Messenger )