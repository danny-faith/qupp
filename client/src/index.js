import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import './index.css';
import App from './App';
// import LoginOrRegister from './LoginOrRegister';
import * as serviceWorker from './serviceWorker';

// class Index extends Component {
//     // state = {
//     //     loggedIn: false,
//     //     currentUser: {
//     //         username: 'John Smith',
//     //         avatar: 'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'
//     //     }
//     // }
//     /**
//      * Simply takes the current user sent back to this function from the
//      * <LoginOrRegister /> component which will get the current user from the <LoginForm />
//      */
//     setCurrentUser = user => {
//         // let currentUser = {...this.state.currentUser};
//         // const {username, avatar} = user;        
//         // currentUser = {
//         //     username,
//         //     avatar
//         // }        
//         // this.setState({
//         //     currentUser
//         // })   
//     }
//     /**
//      * updateLoginState() is passed down to <LoginOrRegister /> and <App />
//      * so both can modify the state.loggedIn
//      * <App /> has the logout button
//      * <LoginOrRegister /> modifies the loggedIn state if login is succesful via the login form
//      */
//     updateLoginState = loginState => {
//         // let copyOfLoginState = {...this.state.loggedIn};
//         // copyOfLoginState = loginState;
        
//         // this.setState({
//         //     loggedIn: copyOfLoginState
//         // });
//     }
//     render() {
//         /**
//          * Route `/`
//          * If state.loggedIn === true : then show the user the <App /> as they are logged in and have access to <App />
//          *                            : else redirect them to `/login`
//          * Route `/login`
//          * If state.loggedIn === true : then show the user the <App /> as they are logged in and shouwl be viewing <App />
//          *                            : else redirect them to <LoginOrRegister /> to login or register
//          */
//         return(
//             <Router>
//                 <div>  
//                     <Route exact path="/" render={() => (
//                         this.state.loggedIn ? (
//                             <App updateLoginState={this.updateLoginState} currentUser={this.state.currentUser} loggedIn={this.state.loggedIn}  />
//                         ) : (
//                             <Redirect to="/login"/>
//                         )
//                     )}/>
//                     <Route path="/login" render={()=> (
//                         this.state.loggedIn ? (
//                             <Redirect to="/" />
//                         ) : (
//                             <LoginOrRegister updateLoginState={this.updateLoginState} currentUser={this.state.currentUser} setCurrentUser={this.setCurrentUser} />
//                         )
//                     )}/>
                    
//                 </div>
//             </Router>
//         )
//     }
// }
    
ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
