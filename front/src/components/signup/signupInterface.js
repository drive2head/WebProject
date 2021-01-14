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
  /**
    * Функция изменяет значения переменных, соответствующих полям пользовательского ввода.
    * @param {object} event объект события, хранящий новое значение и имя поля.
  */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  /**
    * Функция производит регистрацию пользователя. В случае успешной авторизации редиректит на страницу авторизации.
  */
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

    alert(body);
    if (body.status == true) {
      window.location.href = "/signin";
    }
  }
  /**
    * Функция производит редирект на страницу регистрации.
  */
  back () { window.location.href = "/signin" }

  render() {
    document.title = "Регистрация";
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <SignupForm
            handleInputChange={this.handleInputChange.bind(this)}
            signUp={this.signUp.bind(this)}
            back={this.back.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default SignupInterface;
