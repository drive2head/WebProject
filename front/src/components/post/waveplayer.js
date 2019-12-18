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
    this.changeFile = this.changeFile.bind(this);
    this.createWavePlayer = this.createWavePlayer.bind(this);
    this.options = [{value:"drum.wav", label:"drum.wav"}, {value:"str.m4a", label:"str.m4a"}];
    this.state = {selectedOption: {}}
  }

  renderSelect()
  {
    return (
      <Select
        id="files"
        style={{width: '50px'}}
        name="Файлы"
        options={this.options}
        closeMenuOnSelect={true}
        value={this.state.selectedOption}
        onChange={
          (selectedOpt) => {this.changeSelected(selectedOpt)}
        }
      />
    );
  }

  changeSelected(selectedOpt){
    document.getElementById('waveform').innerHTML = '';

    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://speechdb.ru/audio/' + selectedOpt.value);
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = function()
    {
        blob = xhr.response;//xhr.response is now a blob object
        console.log(blob);
    }
    xhr.send();

    this.createWavePlayer('http://speechdb.ru/audio/' + selectedOpt.value);
    this.setState({selectedOption: selectedOpt});
  }

  changeFile(e){
    //console.log(e.target.files[0], URL.createObjectURL(e.target.files[0]));
    this.createWavePlayer(URL.createObjectURL(e.target.files[0]));
    //this.createWavePlayer('http://speechdb.ru/audio/drum.wav');
  }

  createWavePlayer(url)
  {
    let wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'red',
      progressColor: 'red',
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

    document.onkeydown = function (e) {
      let keyCode = e.keyCode;
      if(keyCode == 32) {
        wavesurfer.playPause();
      }
      if(keyCode == 31) {
        let end = document.getElementById('prevEnd');
        let start = document.getElementById('prevStart');
        wavesurfer.clearRegions();
        wavesurfer.addRegion({start: +start.value, end: +end.value});
      }
    };

    wavesurfer.on('ready', function ()
    {
      document.getElementById('slider').oninput = function()
      {
        let slider = document.getElementById('slider');
        let zoomLevel = Number(slider.value);
        wavesurfer.zoom(zoomLevel);
      };
    });
    wavesurfer.on('region-update-end', (region) => {this.props.newTimeInterval(region.start.toFixed(3), region.end.toFixed(3))});
    wavesurfer.on('region-created', (region) => {wavesurfer.clearRegions();});
    wavesurfer.on('region-click', function(region, e) {
      e.stopImmediatePropagation();
      region.play();
    });
    wavesurfer.load(url);
    
  }

  render() {  
    return (
        <div className="col-md-12 px-0">
          <div id="waveform"></div>
          <div id="timeline"></div>
          <input id="slider" type="range" min="1" max="500" defaultValue="1"/>
          <div id="select">
            {this.renderSelect()}
          </div>
          <input type="file" id="file" name="filetoupload" onChange={this.changeFile} />
          <div style={{display: "none"}}> <input id="prevEnd" value={this.props.state.endTime} type="text" /><input id="prevStart" value={this.props.state.startTime} type="text" /> </div>
          <p></p>
        </div>
    );
  }
}

export default WavePlayer;