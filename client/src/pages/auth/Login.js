import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'react-materialize'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextFieldGroup from '../../components/common/TextFieldGroup'
import { loginUser } from '../../actions/authActions'

function Login(props) {
	const [values, setValues] = useState({
		usernameOrEmail: '',
		password: '',
	})
	const [errors, setErrors] = useState({})
	
	const onChange = e => {
		setValues({...values, [e.target.name]: e.target.value})
		setErrors({})
	}
	
  	const onSubmit = e => {
    	e.preventDefault()

		const userData = {
			usernameOrEmail: values.usernameOrEmail,
			password: values.password
		}
    	props.loginUser(userData)
	}

	useEffect(() => {
		if (props.auth.isAuthenticated) {
			props.history.push('/dashboard')
		}
	}, [props.auth])

	useMemo(() => {
		if (props.auth.isAuthenticated) {
			props.history.push('/dashboard')
		}
		setErrors(props.errors)
	}, [props.errors])

	return (
		<Row>
			<Col s={12} m={6} className="offset-m3">
				<h2 className="center">Login</h2>
				<form noValidate onSubmit={onSubmit}>
					<Row>
						<TextFieldGroup
							label="Username or email"
							name="usernameOrEmail"
							type="text"
							value={values.usernameOrEmail}
							onChange={onChange}
							error={errors.usernameOrEmail}
						/>
						<TextFieldGroup
							label="Password"
							name="password"
							type="password"
							value={values.password}
							onChange={onChange}
							error={errors.password}
						/>
						<Col s={12}>
							<Link className='col s12' to="/forgotten-password">Forgotten password?</Link>
							<Button className="btn-small right" waves="light">Login</Button>
						</Col>
					</Row>
				</form>
			</Col>
		</Row>
	)
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(Login)
