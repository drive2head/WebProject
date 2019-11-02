import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

class WavePlayer extends React.Component {  
  constructor(props)
  {
    super(props);

    this.changeFile = this.changeFile.bind(this);
    this.createWavePlayer = this.createWavePlayer.bind(this);
  }

  changeFile(e){this.createWavePlayer(URL.createObjectURL(e.target.files[0]));}

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
      <div>
        <div id="waveform"></div>
        <div id="timeline"></div>
        <input id="slider" type="range" min="1" max="500" defaultValue="1"/>
        <input type="file" id="file" onChange={this.changeFile} />
      </div>
    );
  }
}

export default WavePlayer;