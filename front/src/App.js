import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';

import LoginInterface from './components/login/loginInterface.js';
import SignupInterface from './components/signup/signupInterface.js';
import PostInterface from './components/post/postInterface.js';
import MainInterface from './components/main/mainInterface.js';
import PersonInterface from './components/person/personInterface.js';
import GetInterface from './components/get/getInterface.js';
import UploadInterface from './components/upload/uploadInterface.js';
import DictorInterface from './components/dictor/dictorInterface.js';
import ListInterface from './components/list/listInterface.js';

class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {userAuth: false, username: "", password: ""};
  }

  loggedIn()
  {
    const cookies = new Cookies();
    cookies.getAll();
    //cookies.remove('username');
    return cookies.cookies.username;
  }

  render()
  {
    const isLoggedIn = this.loggedIn();
    return (
      <BrowserRouter>
        <div className="App">

          <Route exact={true} path='/' render={() => (
            isLoggedIn ? (
              <MainInterface/>
            ) : (<Redirect to={{pathname: '/signin'}} />)
          )}/>

          <Route exact={true} path='/get' render={() => (
            isLoggedIn ? (
              <GetInterface/>
            ) : (<Redirect to={{pathname: '/signin'}} />)
          )}/>

          <Route exact={true} path='/list' render={() => (
            isLoggedIn ? (
              <ListInterface/>
            ) : (<Redirect to={{pathname: '/signin'}} />)
          )}/>

          <Route exact={true} path='/post' render={() => (
            isLoggedIn ? (
              <PostInterface/>
            ) : (<Redirect to={{pathname: '/signin'}} />)
          )}/>

          <Route exact={true} path='/upload' render={() => (
            isLoggedIn ? (
              <UploadInterface/>
            ) : (<Redirect to={{pathname: '/signin'}} />)
          )}/>

          <Route exact={true} path='/add_dictor' render={() => (
            isLoggedIn ? (
              <DictorInterface/>
            ) : (<Redirect to={{pathname: '/signin'}} />)
          )}/>

          <Route exact={true} path='/profile' render={() => (
            isLoggedIn ? (
              <PersonInterface/>
            ) : (<Redirect to={{pathname: '/signin'}} />)
          )}/>

          <Route exact={true} path='/signin' render={() => (
            <div className="Login">
              <LoginInterface />
            </div>
          )}/>

          <Route exact={true} path='/signup' render={() => (
            <div className="Login">
              <SignupInterface />
            </div>
          )}/>

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
