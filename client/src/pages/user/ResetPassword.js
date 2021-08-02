import React, { useEffect, useMemo } from 'react'
import { Row, Col } from 'react-materialize'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ChangePassword from '../../components/auth/ChangePassword'

function ForgotPassword(props) {
    useEffect(() => {
        if (!props.auth.isAuthenticated) {
            props.history.push('/login')
        }
    }, [])

    useMemo(() => {
        if (!props.auth.isAuthenticated) {
            props.history.push('/login')
        }
    }, [props.auth])

    return (
        <Row>
            <Col s={6} className="offset-s3">
                <h2 className="center">Reset password</h2>
                <ChangePassword />        
            </Col>
        </Row>
    )
}

ForgotPassword.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps)(withRouter(ForgotPassword))
