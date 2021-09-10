import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { Row, Col } from "react-materialize"
import logo from "../logo-v2.svg"

function Landing(props) {
	useEffect(() => {
		if (props.auth.isAuthenticated) {
			props.history.push("/dashboard")
		}
	}, [props.auth.isAuthenticated, props.history])

	return (
		<div className="landing">
			<div className="container">
				<Row>
					<Col s={8} offset="s2">
						<img className="logo" alt="qupp logo" src={logo} />
						<Row>
							<Col s={8} offset="s2" className="links">
								<Link className="btn" to="/login">
									Login
								</Link>
								<Link className="btn" to="/register">
									Register
								</Link>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		</div>
	)
}

Landing.propTypes = {
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export default connect(mapStateToProps)(Landing)
