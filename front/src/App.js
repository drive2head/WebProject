import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';

import LoginInterface from './components/login/loginInterface.js';
import PostInterface from './components/post/postInterface.js';
let entity = require("./entity.js")

class App extends React.Component {
  constructor(props)
  {
    super(props);

    // Functions binding
    this.saveSound = this.saveSound.bind(this);
    this.saveAll = this.saveAll.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.newTimeInterval = this.newTimeInterval.bind(this);

    this.slider = "";

    this.state = {  
      // Sound info
      startTime: 0,
      endTime: 0,
      soundValue: "",
      soundLang: "",
      soundDialect: "",
      selectedOptions: [],
      sounds: [],

      // Dictor info
      dictorName: "",
      dictorLang: "",
      dictorCity: "",
      dictorCountry: "",
      dictorAccent: "",

      // User info
      showPopup: false,
      userAuth: false,
      username: "",
      password: "",
    };
  }

  saveSound()
  {
    let object = entity.Phoneme(
      this.state.soundValue,
      this.state.startTime,
      this.state.endTime,
      this.state.soundLang,
      this.state.soundDialect,
    );
    let newSounds = this.state.sounds;
    newSounds.push(object);
    this.setState({sounds: newSounds});
    console.log(this.state.sounds);
  }

  saveAll()
  {
    if(this.state.userAuth)
    {
      let person = entity.Speaker(
        this.state.dictorName,
        this.state.dictorLang,
        this.state.dictorCity,
        this.state.dictorCountry,
        this.state.selectedOptions,
      );
      axios.post('/add_data', {
        person: person,
        sounds: this.state.sounds
      });
    }
    else
      this.popUpWindow();
  }

  changeSoundInfo(i)
  {
    let newSounds = this.state.sounds;
    let tmp = newSounds[i];
    newSounds.splice(i, 1);

    this.setState({soundValue: tmp.notation, startTime: tmp.start, endTime: tmp.end, soundLang: tmp.language, soundDialect: tmp.dialect, sounds: newSounds});
    
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':31, 'which':31});
      document.dispatchEvent(evt);}
      , 100); //НЕ СМОТРИТЕ СЮДА, ЭТО КОСТЫЛЬ, ПО-ДРУГОМУ НИКАК, WAVESURFER МАКСИМАЛЬНО КРИВАЯ ЛИБА, ОБЪЕКТ ПЛЕЕРА НЕВОЗМОЖНО ЗАПИХНУТЬ В THIS
    
  }

  newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  changeSelected(selectedOpts){this.setState({selectedOptions: selectedOpts});}
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
       return false;
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
              console.log('nope')
            ) : (<Redirect to={{pathname: '/login'}} />)
          )}/>

          <Route exact={true} path='/get' render={() => (
            isLoggedIn ? (
              console.log('not yet')
            ) : (<Redirect to={{pathname: '/login'}} />)
          )}/>

          <Route exact={true} path='/post' render={() => (
            isLoggedIn ? (
              <PostInterface 
                saveAll={this.saveAll.bind(this)}
                saveSound={this.saveSound.bind(this)}
                handleInputChange={this.handleInputChange.bind(this)}
                userAuth={this.userAuth.bind(this)}
                changeSelected={this.changeSelected.bind(this)}
                newTimeInterval={this.newTimeInterval.bind(this)}
                changeSoundInfo={this.changeSoundInfo.bind(this)}
                state={this.state}
              />
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
