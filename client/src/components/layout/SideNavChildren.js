import React from 'react'
import { Link } from 'react-router-dom'
import { Modal, SideNavItem } from 'react-materialize'
import Messenger from '../messenger/Messenger'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logoutUser } from '../../actions/authActions'
import { clearPlaylists } from '../../actions/playlistActions'
import { withRouter } from 'react-router-dom'

export function SideNavChildren(props) {
    
    const onLogoutClick = (e) => {
        e.preventDefault()
        props.clearPlaylists()
        props.logoutUser(props.history)
    }

    const { isAuthenticated, user } = props.auth

    const authLinks = (
        <React.Fragment>
            <SideNavItem
                user={{
                    background: 'img/office.jpg',
                    image: user.avatar,
                    name: user.username,
                }}
                userView
            />
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/my-account">Account</Link>
            <Modal
                id="messengerUsers"
                className="bg-grey-darkest"
                header="Messenger"
                trigger={
                    <SideNavItem href="!#">
                        Messenger
                    </SideNavItem>
                }
            >
                <Messenger />
            </Modal>
            <SideNavItem divider />
            <SideNavItem onClick={onLogoutClick}>
                Logout
            </SideNavItem>
        </React.Fragment>
    )

    const guestLinks = (
        <React.Fragment>
            <SideNavItem href="/login">
                Login
            </SideNavItem>
            <SideNavItem href="/login">
                Login
            </SideNavItem>
        </React.Fragment>
    )

    return (
        <React.Fragment>
            {isAuthenticated ? authLinks : guestLinks}
        </React.Fragment>
    )

}

SideNavChildren.propTypes = {
	clearPlaylists: PropTypes.func.isRequired,
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser, clearPlaylists })(withRouter(SideNavChildren))