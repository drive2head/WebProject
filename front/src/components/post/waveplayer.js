import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import axios from "axios";
import Select from 'react-select';

class WavePlayer extends React.Component {  
  constructor(props)
  {
    super(props);
    this.slide = this.slide.bind(this);
    this.createWavePlayer = this.createWavePlayer.bind(this);
    this.btn = this.btn.bind(this);
    this.btnLoad = this.btnLoad.bind(this);
    this.options = [];
    this.state = {selectedOption: {}}

    this._CUSTOM_COLOR = 'rgba(238, 255, 100, 0.25)';
  }

  init(f)
  {
    document.getElementById('waveform').innerHTML = '';
    this.createWavePlayer('http://speechdb.ru/audio/' + f.value);
    this.setState({selectedOption: f.value});
    document.getElementById('waveform').focus();
  }

  changeSelected(selectedOpt){
    document.getElementById('waveform').innerHTML = '';
    this.createWavePlayer('http://speechdb.ru/audio/' + selectedOpt.value);
    this.setState({selectedOption: selectedOpt});
    document.getElementById('waveform').focus();
  }

  createWavePlayer(url)
  {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#2a9df4',
      progressColor: '#c2f4ff',
      backend: 'MediaElement',
      plugins: [
        RegionPlugin.create({
          dragSelection: true,
        }),
        Timeline.create({
          primaryLabelInterval: 10,
          timeInterval: 1,
          container: "#timeline"
        })
      ]
    });

    document.onkeydown = (e) => {
      let keyCode = e.keyCode;
      if(keyCode == 32) {
        //console.log('hey');
        this.wavesurfer.playPause();
      }

      if(keyCode == 30) {
        for (let i in this.wavesurfer.regions.list)
        {
          if (!this.wavesurfer.regions.list[i].phoneme)
          {
            this.wavesurfer.regions.list[i].remove();
          }
        }
        let not = this.props.soundValue;
        let region = {};
        for (let i in this.wavesurfer.regions.list)
          if (this.wavesurfer.regions.list[i].id == not)
          {
            region = this.wavesurfer.regions.list[i];
            break;
          }
      }
    };

    // this.wavesurfer.on('ready', function (wavesurfer)
    // {
    //   document.getElementById('slider').oninput = function()
    //   {
    //     let slider = document.getElementById('slider');
    //     let zoomLevel = Number(slider.value);
    //     this.wavesurfer.zoom(zoomLevel);
    //   };
    // });

    this.wavesurfer.on('region-update-end', (region, event) => {  
      document.getElementById('waveform').focus();
      this.props.newTimeInterval(region.start.toFixed(3), region.end.toFixed(3))
    });
    //wavesurfer.on('region-update-end', (region) => {this.props.newTimeInterval(region.start.toFixed(3), region.end.toFixed(3))});
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
    let end = document.getElementById('prevEnd');
    let start = document.getElementById('prevStart');
    
    this.wavesurfer.addRegion({id: this.wavesurfer.regions.list.length, start: +start.value, end: +end.value, color: this._CUSTOM_COLOR});
    let region = {}
    for (let i in this.wavesurfer.regions.list)
      region = this.wavesurfer.regions.list[i];

    region.attributes.label = 'Phoneme';
    region.phoneme = true;    
    region.drag = false;
    let regionEl = region.element;
    let deleteButton = regionEl.appendChild(document.createElement('deleteButton'));
    deleteButton.className = 'fa fa-trash';
    deleteButton.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this.props.deleteRegion(region.start.toFixed(3), document.getElementById('selectPhoneme').innerText);
      region.remove();
    });
    deleteButton.title = "Delete region";
    let css = {
     display: 'flex',
      "justify-content": 'center',
      zIndex: 10,
      cursor: 'pointer',
      cursor: 'hand',
      color: '#02d44f'
    };
    region.style(deleteButton, css);
    let phonemeNotation = regionEl.appendChild(document.createElement('phonemeNotation'+this.wavesurfer.regions.list.length-1));
    //phonemeNotation.title = "Edit region";
    phonemeNotation.innerHTML = document.getElementById('selectPhoneme').innerText;
    // phonemeNotation.addEventListener('click', (e) => {
    //   //e.stopImmediatePropagation();
    //   this.props.changeSoundInfoWave(region.start.toFixed(3));
    // });
    region.style(phonemeNotation, css);
  }

  btnLoad(a, b, c)
  {
    let end = a;
    let start = b;
    ////console.log("a, b = ", a, b);
    this.wavesurfer.addRegion({id: this.wavesurfer.regions.list.length, start: +start, end: +end, color: this._CUSTOM_COLOR});
    let region = {}
    for (let i in this.wavesurfer.regions.list)
      region = this.wavesurfer.regions.list[i];

    region.attributes.label = 'Phoneme';
    region.phoneme = true;
    region.drag = false;    
    //console.log(region);
    let regionEl = region.element;
    let deleteButton = regionEl.appendChild(document.createElement('deleteButton'));
    deleteButton.className = 'fa fa-trash';
    deleteButton.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this.props.deleteRegion(region.start.toFixed(3), c);
      region.remove();
    });
    deleteButton.title = "Delete region";
    let css = {
     display: 'flex',
      "justify-content": 'center',
      zIndex: 10,
      cursor: 'pointer',
      cursor: 'hand',
      color: '#02d44f'
    };
    region.style(deleteButton, css);
    let phonemeNotation = regionEl.appendChild(document.createElement('phonemeNotation'+this.wavesurfer.regions.list.length-1));
    phonemeNotation.innerHTML = c;
    region.style(phonemeNotation, css);
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
          <div id="waveform"></div>
          <div id="timeline"></div>
          <input id="slider" type="range" min="1" max="1000" onInput={this.props.slide} defaultValue="1"/>
          <br/><div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
            </div>
            <div className="col-md-3"></div>
          </div>
          <div style={{display: "none"}}> <input id="prevEnd" value={this.props.state.endTime} type="text" /><input id="prevStart" value={this.props.state.startTime} type="text" /> </div>
          <p></p>
        </div>
    );
  }
}

export default WavePlayer;
