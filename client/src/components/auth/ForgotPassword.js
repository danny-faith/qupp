import React, { useState, useMemo } from 'react'
import { Row, Col, Button } from 'react-materialize'
import TextFieldGroup from '../common/TextFieldGroup'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { forgotPasswordEmailSearch } from '../../actions/authActions'

function ForgotPassword(props) {
	const [email, setEmail] = useState('')
	const [errors, setErrors] = useState({})
    
    const onChange = (e) => {
		setEmail(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
        }

        props.forgotPasswordEmailSearch(userData)
        // Add state = { emailSent: false }
        // TODO if emailSent state == true then clear errors and clear email input 
        // TODO update success message to be in form of form validation
    }

	useMemo(() => {
		setErrors(props.errors)
	}, [props.errors])

    return (
		<Row>
			<Col s={6} className="offset-s3">
				<form noValidate onSubmit={onSubmit}>
					<Row>
						<Col s={12}>
							<TextFieldGroup
								id="email"
								type="email"
								name="email"
								label="Email address"
								s={12}
								onChange={onChange}
								value={email}
								className={classnames({
									'invalid': errors.email
								})}
							/>
							{errors.email && (<p className="red-text col no-margin">{errors.email}</p>)}
						</Col>
					</Row>
					<Row>
						<Col s={12}>
							<Button className="btn-small right" waves="light">Retrieve password</Button>
						</Col>
					</Row>
				</form>
			</Col>
		</Row>
    )
}

ForgotPassword.propTypes = {
    forgotPasswordEmailSearch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})
  
export default connect(mapStateToProps, { forgotPasswordEmailSearch })(ForgotPassword)