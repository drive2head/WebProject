import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

class AudioVizualization extends React.Component {
  constructor(props)
  {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.createWavePlayer = this.createWavePlayer.bind(this);
    this.state = {
      play: false
    };
    this.startTime = 0;
    this.endTime = 0;
  }

  createWavePlayer(url)
  {
    var wavesurfer = WaveSurfer.create({
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
    wavesurfer.on('ready', function ()
    {
      document.getElementById('slider').oninput = function()
      {
        var slider = document.getElementById('slider');
        var zoomLevel = Number(slider.value);
        wavesurfer.zoom(zoomLevel);
      };
    });

    document.onkeydown = function (e) {
      var keyCode = e.keyCode;
      if(keyCode == 32) {
        wavesurfer.playPause();
      }
    };

    wavesurfer.on('region-update-end', (region) => {
      document.getElementById('startTime').innerHTML = region.start.toFixed(3);
      document.getElementById('endTime').innerHTML = region.end.toFixed(3);
    });

    wavesurfer.on('region-created', (region) => {
      wavesurfer.clearRegions();
    });

    wavesurfer.on('region-click', function(region, e) {
      e.stopImmediatePropagation();
      region.play();
    });

    wavesurfer.load(url);
  }

  handleChange(e)
  {
    this.createWavePlayer(URL.createObjectURL(e.target.files[0]));
  }

  render()
  {
    return (
      <div>
        <div id="waveform"></div>
        <div id="timeline"></div>
        <input id="slider" type="range" min="1" max="200" defaultValue="1"/>
        <input type="file" id="file" onChange={this.handleChange} />
        <p id="startTime">Start time: </p>
        <p id="endTime">End time: </p>
      </div>
    );
  }
}

class App extends React.Component {
  render()
  {
    return (
      <div className="App">
        <AudioVizualization/>
      </div>
    );
  }
}

export default App;
