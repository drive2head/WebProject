import React from 'react';
import axios from "axios";
import SoundInfo from './soundInfo.js';
import WavePlayer from './waveplayer.js';
import WavePlayerLetter from './waveplayerletter.js';
import WavePlayerSent from './waveplayersent.js';
import Sounds from './sounds.js';
import Header from '../header.js';
import Cookies from 'universal-cookie';
import Select from 'react-select';

let entity = require("./../../model.js")

class PostInterface extends React.Component {
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
      letterValue: "",
      sentValue: "",
      startTime: 0,
      endTime: 0,
      endTimeLetter: 0,
      startTimeLetter: 0,
      endTimeSent: 0,
      startTimeSent: 0,
      soundValue: "",
      soundLang: "",
      soundStress: "",
      soundDialect: "",
      selectedOptions: [],
      sounds: [],
      letters: [],
      sents: [],
      sent: [],
      soundsList: [],
    };
    this.file='';
    this.options = [];
    this.getOptions();
    window.addEventListener('keydown', function(e) {
      if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });
  }
  /**
    * Функция запоняет список аудиозаписей.
  */
  getOptions = async () =>
  {
    console.log("LOGGZZ: ")
    var response = await fetch('/rec', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let body = await response.json();
    console.log("LOGGZZ BODY: ", body)
    for (let i of body)
      this.options.push({value: i.name, label: i.name})
    //console.log(this.options);
  }

  /**
    * Функция рендерит список аудиозаписей.
    * @returns {JSX} объект JSX со списком аудиозаписей.
  */
  renderSelect()
  {
    return (
      <Select
        autoFocus={false}
        id="files"
        name="Файлы"
        options={this.options}
        openMenuOnFocus
        closeMenuOnSelect={true}
        value={this.state.selectedOption}
        onChange={
          (selectedOpt) => {this.changeSelected(selectedOpt)}
        }
      />
    );
  }

  /**
    * Функция сохраняет очередную фонему.
  */
  saveSound()
  {
    let object = entity.Phoneme(
      this.state.soundValue,
      this.state.startTime,
      this.state.endTime,
      this.state.soundLang,
      this.state.soundDialect,
      this.state.soundStress.value
    );
    let newSounds = this.state.sounds;
    newSounds.push(object);
    this.setState({sounds: newSounds});
    let list = this.state.soundsList;
    list.push({id: list.length, label: this.state.soundValue});
    this.setState({soundsList: list});
    console.log(object);
    this.refs.wave.btn();
    //this.setState({soundValue: ''});
  }
  /**
    * Функция сохраняет очередное слово.
  */
  saveLetter() // Oh, sorry... a letter, yeah?
  {
    let object = entity.Word(
      document.getElementById('letterValue').value,
      document.getElementById('prevStartLetter').value,
      document.getElementById('prevEndLetter').value
    );
    let newLetters = this.state.letters;
    newLetters.push(object);
    this.setState({letters: newLetters});
  }
  /**
    * Функция сохраняет очередное предложение.
  */
  saveSent()
  {
    let object = entity.Sentence(
      document.getElementById('sentValue').value,
      document.getElementById('prevStartSent').value,
      document.getElementById('prevEndSent').value
    );
    let newSents = this.state.sents;
    newSents.push(object);
    this.setState({sents: newSents});
  }
  /**
    * Функция сохраняет всю разметку (посылает запрос /add_data). Далее, происходит редирект на основную страницу.
  */
  async saveAll()
  {
    console.log("DBG saveAll");

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify({record: document.getElementById('files').textContent, phonemes: this.state.sounds, words: this.state.letters, sentences: this.state.sents})],
    {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "razmetochka.json";
    document.body.appendChild(element);
    element.click();

    const cookies = new Cookies();
    cookies.getAll();
    console.log(this.state.sents, this.state.letters, this.state.sounds);
    console.log(document.getElementById('files').textContent);
    axios.post('/update_data', {
      username: cookies.cookies.username,
      recordname: document.getElementById('files').textContent,
      phonemes: this.state.sounds,
      words: this.state.letters,
      sentences: this.state.sents
    })
    .then(result => {
      console.log('/update_data result:\n', result);
    })
    window.alert('Неплохо... А еще можешь? И да, не выбрасывай этот файл, если что по нему мы сможем восстановить твою разметочку :3');
    // window.location.href = "/";
  }

  changeSoundInfoWave(st)
  {
    let newSounds = this.state.sounds;
    let tmp = {};

    for (let i = 0; i < newSounds.length; i++)
      if (newSounds[i].start == st)
      {
        tmp = newSounds[i];
        break;
      }
    let list = this.state.soundsList;
    this.setState({soundValue: tmp.notation, startTime: tmp.start, endTime: tmp.end, soundLang: tmp.language, soundDialect: tmp.dialect, sounds: newSounds, soundsList: list});
    //console.log(this.state.soundValue);
    setTimeout( () => {
      var evt = new KeyboardEvent('keydown', {'keyCode':30, 'which':30});
      document.dispatchEvent(evt);}
      , 100); //НЕ СМОТРИТЕ СЮДА, ЭТО КОСТЫЛЬ, ПО-ДРУГОМУ НИКАК, WAVESURFER МАКСИМАЛЬНО КРИВАЯ ЛИБА, ОБЪЕКТ ПЛЕЕРА НЕВОЗМОЖНО ЗАПИХНУТЬ В THIS
  }
  /**
    * Функция удаляет фонему из списка добавленных.
    * @param {float} st начало интервала с точностью до 3 знаков после запятой.
  */
  deleteRegion(st)
  {
    let i = 0;
    let newSounds = this.state.sounds;
    for (i = 0; i < newSounds.length; i++)
      if (newSounds[i].start == st)
        break;
    let tmp = newSounds[i];
    newSounds.splice(i, 1);
    let list = this.state.soundsList;
    list.splice(i, 1);

    for(let i = 0; i < list.length; i++)
      if (list[i].id != i)
        list[i].id = i;
    this.setState({sounds: newSounds, soundsList: list});
  }

  /**
    * Функция удаляет слово из списка добавленных.
    * @param {float} st начало интервала с точностью до 3 знаков после запятой.
  */
  deleteLetter(st)
  {
    let i = 0;
    let newLetters = this.state.letters;
    for (i = 0; i < newLetters.length; i++)
      if (newLetters[i].start == st)
        break;
    let tmp = newLetters[i];
    newLetters.splice(i, 1);

    this.setState({letters: newLetters});
  }
  /**
    * Функция удаляет предложение из списка добавленных.
    * @param {float} st начало интервала с точностью до 3 знаков после запятой.
  */
  deleteSent(st)
  {
    let i = 0;
    let newSents = this.state.sents;
    for (i = 0; i < newSents.length; i++)
      if (newSents[i].start == st)
        break;
    let tmp = newSents[i];
    newSents.splice(i, 1);

    this.setState({sents: newSents});
  }

  /**
    * Функция инициализирует 3 визуализатора с выбранным аудиофайломх.
    * @param {string} selectedOpt название аудиофайла.
  */
  changeSelected(selectedOpt){
    this.file = selectedOpt;
    this.refs.wave.init(this.file);
    this.refs.waveletter.init(this.file);
    this.refs.wavesent.init(this.file);
  }
  /**
    * Функция инициализирует 3 слайдера для масштабирования визуализатора.
  */
  slide()
  {
    this.refs.wave.slide();
    this.refs.waveletter.slide();
    this.refs.wavesent.slide();
  }
  /**
    * Функция изменяет язык диктора.
    * @param {string} l язык диктора.
  */
  changeLang(l) {this.setState({soundLang: l})}

  changeStress(l) {this.setState({ soundStress: l})}
  /**
    * Функция изменяет значение фонемы.
    * @param {string} l значение фонемы.
  */
  changeNotation(l) {this.setState({soundValue: l})}
  /**
    * Функция изменяет временные границы выбранного отрезка для фонем.
    * @param {float} start начало интервала с точностью до 3 знаков после запятой.
    * @param {float} end конец интервала с точностью до 3 знаков после запятой.
  */
  newTimeInterval(start, end){this.setState({startTime: start, endTime: end})}
  /**
    * Функция изменяет значения переменных, соответствующих полям пользовательского ввода.
    * @param {object} event объект события, хранящий новое значение и имя поля.
  */
  handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}
  /**
    * Функция изменяет временные границы выбранного отрезка для слов.
    * @param {float} start начало интервала с точностью до 3 знаков после запятой.
    * @param {float} end конец интервала с точностью до 3 знаков после запятой.
  */
  newTimeIntervalLetter(start, end){this.setState({startTimeLetter: start, endTimeLetter: end});}
  /**
    * Функция изменяет временные границы выбранного отрезка для предложений.
    * @param {float} start начало интервала с точностью до 3 знаков после запятой.
    * @param {float} end конец интервала с точностью до 3 знаков после запятой.
  */
  newTimeIntervalSent(start, end){this.setState({startTimeSent: start, endTimeSent: end});}

  render() {
    document.title = "Новая разметка";
    return (
      <div className="container-fluid">
        <Header/>
        <div className="jumbotron" style={{borderRadius: "25px"}}>
          <div id="select" style={{width: '100%'}}>
            {this.renderSelect()}
          </div>
          <WavePlayerSent
            slide={this.slide.bind(this)}
            ref="wavesent"
            handleInputChange={this.handleInputChange.bind(this)}
            newTimeIntervalSent={this.newTimeIntervalSent.bind(this)}
            deleteSent={this.deleteSent.bind(this)}
            saveSent={this.saveSent.bind(this)}
            state={this.state}
          />
          <WavePlayerLetter
            slide={this.slide.bind(this)}
            ref="waveletter"
            handleInputChange={this.handleInputChange.bind(this)}
            newTimeIntervalLetter={this.newTimeIntervalLetter.bind(this)}
            deleteLetter={this.deleteLetter.bind(this)}
            saveLetter={this.saveLetter.bind(this)}
            state={this.state}
          />
          <WavePlayer
            slide={this.slide.bind(this)}
            ref="wave"
            file={this.file}
            newTimeInterval={this.newTimeInterval.bind(this)}
            state={this.state}
            changeSoundInfoWave={this.changeSoundInfoWave.bind(this)}
            soundValue={this.state.soundValue}
            deleteRegion={this.deleteRegion.bind(this)}
          />
          <div className="row">
            <div className="col-md-3">

            </div>
            <SoundInfo
              changeNotation={this.changeNotation.bind(this)}
              changeLang={this.changeLang.bind(this)}
              changeStress={this.changeStress.bind(this)}
              handleInputChange={this.handleInputChange.bind(this)}
              saveSound={this.saveSound.bind(this)}
              saveLetter={this.saveLetter.bind(this)}
              state={this.state}
            />
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <button className="btn btn-magick btn-lg btn3d" id="saveData" style={{border: "none"}, {width:"100%"}} onClick={this.saveAll}>Сохранить запись</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PostInterface;
