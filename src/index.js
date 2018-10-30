import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import './index.css';
import App from './App';
import LoginOrRegister from './LoginOrRegister';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

class Index extends Component {
    state = {
        loggedIn: true,
        currentUser: {
            username: 'John Smith',
            avatar: 'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'
        }
    }
    setCurrentUser = user => {
        let currentUser = {...this.state.currentUser};
        const {username, avatar} = user;        
        currentUser = {
            username,
            avatar
        }        
        this.setState({
            currentUser
        })   
    }
    render() {
        return(
            <Router>
                <div>  
                    <Route exact path="/" render={() => (
                        this.state.loggedIn ? (
                            <App currentUser={this.state.currentUser} loggedIn={this.state.loggedIn}  />
                        ) : (
                            <Redirect to="/login"/>
                        )
                        )}/>
                    <Route path="/login" render={()=><LoginOrRegister currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser}/>} />
                </div>
            </Router>
        )
    }
}
    
ReactDOM.render(<Index/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
