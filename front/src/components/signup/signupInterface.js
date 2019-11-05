import React from 'react';
import SignupForm from './signupForm.js';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Cookies from 'universal-cookie';

class SignupInterface extends React.Component {  
  constructor(props)
  {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {username: "", password: "", name: "", surname: ""};
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  signUp = async () => {
    var response = await fetch('/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        name: this.state.name,
        surname: this.state.surname,
      })
    });

    var body = await response.json();

    if (body == false)
      alert('Bad data, FILOLUX!');
    else
      window.location.href = "/signin";      
  }

  render() {  
    return (  
      <div className='popup'>  
        <div className='popup_inner'>
          <SignupForm
            handleInputChange={this.handleInputChange.bind(this)}
            signUp={this.signUp.bind(this)}
          />
        </div>  
      </div>  
    );  
  }  
} 

export default SignupInterface;