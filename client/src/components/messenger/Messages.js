import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Textarea, Row, Col, Button } from 'react-materialize'
import { firebase } from '../../base'
import classNames from 'classnames'
import isEmpty from '../../validation/is-empty'

export function Messages(props) {
    const db = firebase.database()
    const chatTextStream = React.createRef()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    // TODO: Loadin and no messages
    // todo: enter key to submit new message

    useEffect(() => {
        const messengerRef = db.ref(`messenger/${props.messenger.messageRoom._id}`)

        messengerRef.on("value", (snapshot) => {
            const snapShot = snapshot.val()
            let toAdd

            if (snapShot === null) {
                toAdd = []
            } else {
                toAdd = (Array.isArray(snapShot))
                    ? snapShot
                    : [snapShot]
            }

            setMessages(toAdd)
        })
            
        return () => messengerRef.off()
    }, [props.messenger])
        
    useEffect(() => {
        if (messages && messages.length > 0) {
            scrollMessagesToBottom()
        }
    })

    if (!messages) {
        return <div>No messages</div>
    }

    const handleOnChange = (e) => {
        setMessage(e.target.value)
    }
    const scrollMessagesToBottom = () => {
        chatTextStream.current.scrollTop = chatTextStream.current.scrollHeight
    }

    const handleFormSubmit = (e) => {
        if (!isEmpty(e)) {
            e.preventDefault()
        }
        if (message === '') {
            return
        }
        const newMessage = {
            text: message,
            user: props.auth.user.id,
            date: Date()
        }

        const copyOfMessages = {...messages}

        messages.push(newMessage)
        setMessages(copyOfMessages)
        setMessage('')
        db.ref(`messenger/${props.messenger.messageRoom._id}`).set(messages)
        scrollMessagesToBottom()
    }

    let messagesMarkup = ''
    if (messages && messages.length > 0) {
        messagesMarkup = messages.map((message, index) =>
            <Row className="m-0" key={index}>
                <Col s={12}>
                    <p 
                        className={
                            classNames('message message--recipient p-3 rounded-sm m-1', {
                                    'text-right bg-blue-dark float-right': message.user === props.auth.user.id,
                                    'bg-grey-dark float-left': message.user !== props.auth.user.id
                                }
                            )
                        }
                    >
                        {message.text}
                    </p>
                </Col>
            </Row>
        )
    } else {
        messagesMarkup = 'Loading messages'
    }
    
    return (
        <div>
            <div ref={chatTextStream} className="chat-textstream mt-4">
                {messagesMarkup}
                <div className="clearfix"></div>
            </div>
            <form onSubmit={handleFormSubmit}>
                <Textarea name="message" onChange={handleOnChange} placeholder="Message" value={message} />
                <Button>Send</Button>
            </form>
        </div>
    )
}

Messages.propTypes = {
    auth: PropTypes.object.isRequired,
	messenger: PropTypes.object
}

const mapStateToProps = (state) => ({
    auth: state.auth,
	messenger: state.messenger    
})

export default connect(mapStateToProps, {})(Messages)