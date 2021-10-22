import React, { Fragment, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ForgotPassword from "../../components/auth/ForgotPassword"

function ForgotPasswordPage(props) {
	useEffect(() => {
		if (props.auth.isAuthenticated) {
			props.history.push("/dashboard")
		}
	})

	useMemo(() => {
		if (props.auth.isAuthenticated) {
			props.history.push("/dashboard")
		}
	}, [props.auth.isAuthenticated, props.history])

	return (
		<Fragment>
			<h2 className="center">Forgot password?</h2>
			<ForgotPassword />
		</Fragment>
	)
}

ForgotPasswordPage.propTypes = {
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export default connect(mapStateToProps)(ForgotPasswordPage)
