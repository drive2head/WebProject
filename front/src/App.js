import React from 'react';
import logo from './logo.svg';
import './App.css';
import AudioPlayerDOM from './components/AudioPlayerDOM.js';

class AudioVizualization extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      play: false
    };
  }

  handleChange(e) {
    var audio = document.getElementById("audio");
    audio.src = URL.createObjectURL(e.target.files[0]);
    
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }
    renderFrame();
  }

  render()
  {
    return (
      <div>
        <canvas id="canvas"></canvas>
        <input type="file" id="file" onChange={this.handleChange} />
        <audio id="audio" controls> </audio>
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
