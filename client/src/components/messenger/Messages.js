import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textarea, Row, Col, Button } from 'react-materialize';
import classNames from 'classnames';

class Messages extends Component {
    chatTextStream = React.createRef();
    state = {
        message: '',
        messages: [
            {
                text: 'hello mate',
                user: '5c73c5f88dfe94aed2067383'
            },
            {
                text: 'hello there bro',
                user: '5c596765a1075c1d8d8d3120'
            }
        ]
    }
    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        const message = {
            text: this.state.message,
            user: this.props.auth.user.id
        }
        let copyOfState = {...this.state};
        copyOfState.messages.push(message);
        copyOfState.message = '';
        this.setState({
            copyOfState
        }, function() {
            console.log(this.chatTextStream.current.scrollTop);
            
            this.chatTextStream.current.scrollTop = this.chatTextStream.current.scrollHeight;
        });
    }
    render() {
        const messages = this.state.messages.map(message =>
            <Row className="m-0">
                <Col s={12}>
                    <p 
                        key={message} 
                        className={
                            classNames('message message--recipient p-2 rounded-sm', {
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
        
        return (
            <div>
                <div ref={this.chatTextStream} className="chat-textstream">
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
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, {})(Messages);