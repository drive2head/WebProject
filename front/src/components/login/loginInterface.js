import React from 'react';
import LoginForm from './loginForm.js';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Cookies from 'universal-cookie';

class LoginInterface extends React.Component {
  constructor(props)
  {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {username: "", password: ""};
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
    * Функция производит редирект на страницу регистрации.
  */
  signUp() { window.location.href = "/signup" };
  /**
    * Функция производит авторизацию пользователя. В случае успешной авторизации редиректит на главную страницу.
  */
  signIn = async () => {
    // console.log("signIn")
    var response = await fetch('/signin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    });
    // console.log("signIn res")

    var body = await response.json();

    if (response.status === 200) {
      if (!body.status) {
        alert(body.msg);
      } else {
        const cookies = new Cookies();
        cookies.set('username', this.state.username, { path: '/' });
        cookies.set('password', this.state.password, { path: '/' });
        //cookies.set('role', body.role, { path: '/' });
        window.location.href = "/";
      }
    } else {
      alert(`Error ${response.status}`)
    }


  }

  render() {
    document.title = "Вход";
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <LoginForm
            handleInputChange={this.handleInputChange.bind(this)}
            signIn={this.signIn.bind(this)}
            signUp={this.signUp}
          />
        </div>
      </div>
    );
  }
}

export default LoginInterface;
