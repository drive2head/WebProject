import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';

import LoginInterface from './components/login/loginInterface.js';
import PostInterface from './components/post/postInterface.js';
import MainInterface from './components/main/mainInterface.js';

class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {userAuth: false, username: "", password: ""};
  }

  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}

  loggedIn()
  {
    // var response = await fetch('/login', {
    //   method: 'POST',
    //   headers: {
    //       'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     username: this.state.username,
    //     password: this.state.password,
    //   })
    // });

    // var body = await response.json();
    // if (body == true)
    //   window.location.href = "/";
    // else
       return true;
    // this.setState({userAuth: , username: , password: ,});
  }

  render()
  {
    const isLoggedIn = this.loggedIn();
    return (
      <BrowserRouter>
        <div className="App">

          <Route exact={true} path='/' render={() => (
            isLoggedIn ? (
              <MainInterface />
            ) : (<Redirect to={{pathname: '/login'}} />)
          )}/>

          <Route exact={true} path='/get' render={() => (
            isLoggedIn ? (
              console.log('not yet')
            ) : (<Redirect to={{pathname: '/login'}} />)
          )}/>

          <Route exact={true} path='/post' render={() => (
            isLoggedIn ? (
              <PostInterface />
            ) : (<Redirect to={{pathname: '/login'}} />)
          )}/>

          <Route exact={true} path='/login' render={() => (
            <div className="Login">
              <LoginInterface handleInputChange={this.handleInputChange.bind(this)} />
            </div>
          )}/>

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
