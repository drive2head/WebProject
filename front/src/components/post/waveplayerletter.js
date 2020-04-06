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
    this.createWavePlayerLetter = this.createWavePlayerLetter.bind(this);
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
    document.getElementById('waveformletter').innerHTML = '';
    this.createWavePlayerLetter('http://speechdb.ru/audio/' + selectedOpt.value);
    this.setState({selectedOption: selectedOpt});
  }

  createWavePlayerLetter(url)
  {
    let wavesurfer = WaveSurfer.create({
      container: '#waveformletter',
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
          container: "#timelineletter"
        })
      ]
    });

    document.onkeydown = (e) => {
      let keyCode = e.keyCode;

      if(keyCode == 29) {
        let end = document.getElementById('prevEndLetter');
        let start = document.getElementById('prevStartLetter');

        wavesurfer.addRegion({id: document.getElementById('letterValue').value, start: +start.value, end: +end.value, color: 'hsla(100, 100%, 30%, 0.1)'});
        console.log(wavesurfer.regions.list);
        let region = {};
        for (let i in wavesurfer.regions.list)
        {
          region = wavesurfer.regions.list[i];
        }

        region.attributes.label = 'Letter';

        let regionEl = region.element;
        let css = {
         display: 'flex',
          "justify-content": 'center',
          zIndex: 10,
          cursor: 'pointer',
          cursor: 'hand',
          color: '#129fdd'
        };
        let letterNotation = regionEl.appendChild(document.createElement('letterNotation'));
        
        region.style(letterNotation, css);
      }
    };

    wavesurfer.on('ready', function ()
    {
      document.getElementById('sliderletter').oninput = function()
      {
        let slider = document.getElementById('sliderletter');
        let zoomLevel = Number(slider.value);
        wavesurfer.zoom(zoomLevel);
      };
    });

    wavesurfer.on('region-update-end', (region, event) => {  
      document.getElementById('waveformletter').focus();
      this.props.newTimeIntervalLetter(region.start.toFixed(3), region.end.toFixed(3))
    });
    //wavesurfer.on('region-update-end', (region) => {this.props.newTimeInterval(region.start.toFixed(3), region.end.toFixed(3))});
    wavesurfer.on('region-created', (region) => {
      for (let i in wavesurfer.regions.list)
      {
        if (!wavesurfer.regions.list[i].phoneme)
        {
          wavesurfer.regions.list[i].remove();
        }
      }
    });
    wavesurfer.on('region-click', function(region, e) {
      e.stopImmediatePropagation();
      region.play();
    });
    wavesurfer.load(url);
    
  }

  render() {  
    return (
        <div className="col-md-12 px-0">
          <div id="waveformletter"></div>
          <div id="timelineletter"></div>
          <input id="sliderletter" type="range" min="1" max="1000" defaultValue="1"/>
          <br/><div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div id="select" style={{width: '100%'}}>
                {this.renderSelect()}
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
