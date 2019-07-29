import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textarea, Row, Col, Button } from 'react-materialize';
import base from '../../base';
import firebaseApp from '../../base';
import classNames from 'classnames';
import isEmpty from '../../validation/is-empty';

require('dotenv').config();

const { 
  REACT_APP_FIREBASE_EMAIL,
  REACT_APP_FIREBASE_PASSWORD
} = process.env;

class Messages extends Component {
    chatTextStream = React.createRef();
    state = {
        message: '',
        messages: []
    }
    componentDidMount = () => {
        firebaseApp.initializedApp.auth().signInWithEmailAndPassword(REACT_APP_FIREBASE_EMAIL, REACT_APP_FIREBASE_PASSWORD).catch(function(error) {
            // Handle Errors here.
            window.M.toast({html: `${error.code} ${error.message}`, classes: 'red lighten-2'})
        }).then(() => {
            base.syncState(`messenger/${this.props.messenger.messageRoom[0]._id}`, {
                context: this,
                state: 'messages',
                then() {
                }
              });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                // this.handleFormSubmit(e);
            }
        })
    }
    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleFormSubmit = (e) => {
        e.preventDefault();
        if (this.state.message === '') {
            return;
        }
        const message = {
            text: this.state.message,
            user: this.props.auth.user.id
        }
        let copyOfState = {...this.state};
        if (isEmpty(copyOfState.messages)){
            copyOfState.messages = [];
        }
        copyOfState.messages.push(message);
        copyOfState.message = '';
        this.setState(
            copyOfState, () => {
            this.chatTextStream.current.scrollTop = this.chatTextStream.current.scrollHeight;
        });
    }
    render() {
        let messages = '';
        if (!isEmpty(this.state.messages)) {
            messages = this.state.messages.map(message =>
                <Row className="m-0">
                    <Col s={12}>
                        <p 
                            key={message} 
                            className={
                                classNames('message message--recipient p-2 rounded-sm m-1', {
                                        'text-right bg-blue-dark float-right': message.user === this.props.auth.user.id,
                                        'bg-grey-dark float-left': message.user !== this.props.auth.user.id
                                    }
                                )
                            }
                        >
                            {message.text}
                        </p>
                    </Col>
                </Row>
            );
        } else {
            messages = 'No messages';
        }
        
        return (
            <div>
                <div ref={this.chatTextStream} className="chat-textstream mt-4">
                    {messages}
                    <div className="clearfix"></div>
                </div>
                <form onSubmit={this.handleFormSubmit}>
                    <Textarea name="message" onChange={this.handleOnChange} placeholder="Message" value={this.state.message} />
                    <Button>Send</Button>
                </form>
            </div>
        )
    }
}

Messages.propTypes = {
    auth: PropTypes.object.isRequired,
	messenger: PropTypes.object
};

const mapStateToProps = (state) => ({
    auth: state.auth,
	messenger: state.messenger    
});

export default connect(mapStateToProps, {})(Messages);