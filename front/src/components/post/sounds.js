import React from 'react';

class Sounds extends React.Component {  
  constructor(props)
  {
    super(props);
  }

  render() {  
    return (
      <div className="col-md-2">
        <div className="card flex-md-row mb-4 box-shadow h-md-250">
          <div className="card-body d-flex flex-column align-items-start">
            <p>Добавленные фонемы:</p>
            <ul>{this.listSounds = this.props.sounds.map((sound, i) =>
                <li key={i}><button id={i} onClick={() => {this.props.changeSoundInfo(i)}}>{sound.notation}</button></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Sounds;