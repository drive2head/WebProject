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
    this.createWavePlayer = this.createWavePlayer.bind(this);
    this.options = [];
    this.getOptions();
    this.state = {selectedOption: {}}
  }

  getOptions = async () =>
  {
    var response = await fetch('/records', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let body = await response.json();
    for (let i of body)
      this.options.push({value: i.name, label: i.name})
    console.log(this.options);
  }

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

  changeSelected(selectedOpt){
    document.getElementById('waveform').innerHTML = '';
    this.createWavePlayer('http://speechdb.ru/audio/' + selectedOpt.value);
    this.setState({selectedOption: selectedOpt});
    document.getElementById('waveform').focus();
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
          <input id="slider" type="range" min="1" max="1000" defaultValue="1"/>
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-5">
              <div id="select" style={{width: '100%'}}>
                {this.renderSelect()}
              </div>
            </div>
          </div>
          <div style={{display: "none"}}> <input id="prevEnd" value={this.props.state.endTime} type="text" /><input id="prevStart" value={this.props.state.startTime} type="text" /> </div>
          <p></p>
        </div>
    );
  }
}

export default WavePlayer;