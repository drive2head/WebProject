import React from 'react';
import wavesurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import axios from "axios";
import Select from 'react-select';

class WavePlayer extends React.Component {  
  constructor(props)
  {
    super(props);
    this.createWavePlayerLetter = this.createWavePlayerLetter.bind(this);
    this.slide = this.slide.bind(this);
    this.btn = this.btn.bind(this);
    this.options = [];
    this.state = {selectedOption: {}}

    this._CUSTOM_COLOR = 'rgba(225, 116, 237, 0.4)';
  }

  init(f)
  {
    document.getElementById('waveformletter').innerHTML = '';
    this.createWavePlayerLetter('http://speechdb.ru/audio/' + f.value);
    this.setState({selectedOption: f.value});
  }

  changeSelected(selectedOpt){
    document.getElementById('waveformletter').innerHTML = '';
    this.createWavePlayerLetter('http://speechdb.ru/audio/' + selectedOpt.value);
    this.setState({selectedOption: selectedOpt});
  }

  createWavePlayerLetter(url)
  {
    this.wavesurfer = wavesurfer.create({
      container: '#waveformletter',
      waveColor: '#50C878',
      progressColor: 'orange',
      backend: 'MediaElement',
      plugins: [
        RegionPlugin.create({
          dragSelection: true,
        }),
        Timeline.create({
          primaryLabelInterval: 10,
          timeInterval: 1,
          container: "#timelineletter"
        })
      ]
    });

    this.wavesurfer.on('region-update-end', (region, event) => {  
      document.getElementById('waveformletter').focus();
      this.props.newTimeIntervalLetter(region.start.toFixed(3), region.end.toFixed(3))
    });
    //this.wavesurfer.on('region-update-end', (region) => {this.props.newTimeInterval(region.start.toFixed(3), region.end.toFixed(3))});
    this.wavesurfer.on('region-created', (region) => {
      for (let i in this.wavesurfer.regions.list)
      {
        if (!this.wavesurfer.regions.list[i].phoneme)
        {
          this.wavesurfer.regions.list[i].remove();
        }
      }
    });
    this.wavesurfer.on('region-click', function(region, e) {
      e.stopImmediatePropagation();
      region.play();
    });
    this.wavesurfer.load(url);
    
  }

  btn()
  {
    let end = document.getElementById('prevEndLetter');
    let start = document.getElementById('prevStartLetter');
    this.props.saveLetter();
    this.wavesurfer.addRegion({id: this.wavesurfer.regions.list.length, start: +start.value, end: +end.value, color: this._CUSTOM_COLOR});
    //console.log(this.wavesurfer.regions.list);
    let region = {};
    for (let i in this.wavesurfer.regions.list)
    {
      region = this.wavesurfer.regions.list[i];
    }

    region.attributes.label = 'Letter';
    region.phoneme = true;  
    region.drag = false;

    let regionEl = region.element;
    let deleteButton = regionEl.appendChild(document.createElement('deleteButton'));
    deleteButton.className = 'fa fa-trash';
    deleteButton.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this.props.deleteLetter(region.start.toFixed(3), document.getElementById('letterValue').innerText);
      region.remove();
    });
    deleteButton.title = "Delete region";
    let css = {
     display: 'flex',
      "justify-content": 'center',
      zIndex: 10,
      cursor: 'pointer',
      cursor: 'hand',
      color: '#129fdd'
    };
    region.style(deleteButton, css);

    regionEl = region.element;
    let letterNotation = regionEl.appendChild(document.createElement('letterNotation'+this.wavesurfer.regions.list.length-1));
    //console.log(region.id);

    letterNotation.title = "Edit region";
    letterNotation.innerHTML = document.getElementById('letterValue').value;
    region.style(letterNotation, css);
  }

  btnLoad(a, b, c)
  {
    let end = a;
    let start = b;
    this.props.saveLetter();
    this.wavesurfer.addRegion({id: this.wavesurfer.regions.list.length, start: +start, end: +end, color: this._CUSTOM_COLOR});
    //console.log(this.wavesurfer.regions.list);
    let region = {};
    for (let i in this.wavesurfer.regions.list)
    {
      region = this.wavesurfer.regions.list[i];
    }

    region.attributes.label = 'Letter';
    region.phoneme = true;  
    region.drag = false;
    let regionEl = region.element;
    let deleteButton = regionEl.appendChild(document.createElement('deleteButton'));
    deleteButton.className = 'fa fa-trash';
    deleteButton.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this.props.deleteLetter(region.start.toFixed(3), c);
      region.remove();
    });
    deleteButton.title = "Delete region";
    let css = {
     display: 'flex',
      "justify-content": 'center',
      zIndex: 10,
      cursor: 'pointer',
      cursor: 'hand',
      color: '#129fdd'
    };
    region.style(deleteButton, css);

    regionEl = region.element;
    let letterNotation = regionEl.appendChild(document.createElement('letterNotation'+this.wavesurfer.regions.list.length-1));
    //console.log(region.id);

    letterNotation.title = "Edit region";
    letterNotation.innerHTML = c;
    region.style(letterNotation, css);
  }

  slide()
  {
    let slider = document.getElementById('slider');
    let zoomLevel = Number(slider.value);
    //console.log(this.wavesurfer);
    this.wavesurfer.zoom(zoomLevel);
  }

  render() {  
    return (
        <div className="col-md-12 px-0">
          <div id="waveformletter"></div>
          <div id="timelineletter"></div>
          <br/><div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div className="card bg-dark box-shadow">
                <input className="" name="letterValue" id="letterValue" placeholder="Тут слово..." onChange={this.props.handleInputChange} type="text"/><br/>
                <button className="btn btn-primary btn-md btn3d" name="saveSound" onClick={this.btn}>Добавить слово</button>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
          <div style={{display: "none"}}> <input id="prevEndLetter" value={this.props.state.endTimeLetter} type="text" /><input id="prevStartLetter" value={this.props.state.startTimeLetter} type="text" /> </div>
          <p></p>
        </div>
    );
  }
}

export default WavePlayer;
