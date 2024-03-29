import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Modal, SideNav } from "react-materialize"
import Messenger from "../messenger/Messenger"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { logoutUser } from "../../actions/authActions"
import { clearPlaylists } from "../../actions/playlistActions"
import { withRouter } from "react-router-dom"

import logo from "../../logo-v2.svg"
import { SideNavChildren } from "./SideNavChildren"

export function Navbar({ auth, clearPlaylists, logoutUser, history }) {
	const dropdownTriggerRef = React.createRef()
	const messengerRef = React.createRef()
	const navRef = React.createRef()
	const { isAuthenticated, user } = auth

	useEffect(() => {
		if (auth.isAuthenticated) {
			window.M.Dropdown.init(dropdownTriggerRef.current)
		}
	}, [auth, dropdownTriggerRef])

	const onLogoutClick = (e) => {
		e.preventDefault()
		clearPlaylists()
		logoutUser(history)
	}

	const authorisedLinks = (
		<ul id="nav-mobile" className="right hide-on-med-and-down">
			<li>
				<a href="!#" onClick={onLogoutClick}>
					Logout
				</a>
			</li>
			<li>
				<Modal
					id="messengerUsers"
					className="bg-grey-darkest"
					header="Messenger"
					trigger={
						<a ref={messengerRef} href="!#">
							Messenger
						</a>
					}
				>
					<Messenger />
				</Modal>
			</li>
			<li className="avatar">
				<a
					href="!#"
					ref={dropdownTriggerRef}
					data-target="dropdown1"
					className="dropdown-trigger"
				>
					<div
						className="avatar"
						style={{ backgroundImage: `url(${user.avatar})` }}
					></div>
					{user.username}
				</a>
				<ul id="dropdown1" className="dropdown-content">
					<li>
						<Link to="/dashboard">Dashboard</Link>
					</li>
					<li>
						<Link to="/my-account">Account</Link>
					</li>
					<li className="divider"></li>
					<li>
						<a href="!#" onClick={onLogoutClick}>
							Logout
						</a>
					</li>
				</ul>
			</li>
		</ul>
	)

	const guestLinks = (
		<ul id="nav-mobile" className="right hide-on-med-and-down">
			<li>
				<Link to="/login">Login</Link>
			</li>
			<li>
				<Link to="/register">Register</Link>
			</li>
		</ul>
	)

	return (
		<nav ref={navRef}>
			<div className="nav-wrapper">
				<Link to="/" className="brand-logo">
					<img
						width="90"
						alt="qupp logo"
						src={logo}
						className="ml-1"
					/>
				</Link>
				<SideNav
					options={{
						draggable: true,
					}}
					trigger={<i className="material-icons">menu</i>}
					children={
						<SideNavChildren
							auth={auth}
							clearPlaylists={clearPlaylists}
							logoutUser={logoutUser}
						/>
					}
				/>
				{isAuthenticated ? authorisedLinks : guestLinks}
			</div>
		</nav>
	)
}

Navbar.propTypes = {
	clearPlaylists: PropTypes.func.isRequired,
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export default connect(mapStateToProps, { logoutUser, clearPlaylists })(
	withRouter(Navbar)
)
