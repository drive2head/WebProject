import React from 'react';
import LoginForm from './loginForm.js';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

class Popup extends React.Component {  
  constructor(props)
  {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {username: "", password: ""};
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  logIn = async () => {
    var response = await fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    });

    var body = await response.json();
    if (body == true)
      window.location.href = "/";
    else
      alert('Wrong data, dear FILOLUX!');
  }

  render() {  
    return (  
      <div className='popup'>  
        <div className='popup_inner'>
          <LoginForm
            handleInputChange={this.handleInputChange.bind(this)}
            logIn={this.logIn.bind(this)}
          />
        </div>  
      </div>  
    );  
  }  
} 

export default Popup;