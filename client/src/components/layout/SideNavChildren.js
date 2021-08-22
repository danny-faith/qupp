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
    // const messengerRef = React.createRef()
    // const usersRef = React.createRef()

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
                    // email: user.email,
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
        // <ul className="sidenav" id="sidenav">
        //     <li>
        //         <div className="user-view">
        //             <div className="background">
        //                 <img alt="background for user" src="img/office.jpg" />
        //             </div>
        //             <a href="#user">
        //                 <div className="avatar" style={{ backgroundImage: `url(${user.avatar})`}}>
        //                 </div>
        //             </a>
        //             <a href="#name"><span className="white-text name pb-4">{user.username}</span></a>
        //         </div>
        //     </li>

        //     <li><Link to="/dashboard">Dashboard</Link></li>
        //     <li><Link to="/my-account">Account</Link></li>
        //     <li>
        //         <Modal
        //             id="messengerUsers"
        //             className="bg-grey-darkest"
        //             header="Messenger"
        //             ref={usersRef}
        //             trigger={
        //                 <a ref={messengerRef} href="!#">
        //                     Messenger
        //                 </a>
        //             }
        //         >
        //             <Messenger />
        //         </Modal>
        //     </li>
        //     <li className="divider"></li>
        //     <li><button onClick={onLogoutClick}>Logout</button></li>
        // </ul>
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