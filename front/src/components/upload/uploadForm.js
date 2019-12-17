import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Header from '../header.js';

class UploadForm extends React.Component {  
	constructor(props) {
		super(props);
		this.changeDictor = this.changeDictor.bind(this);
		this.state = {  
			dictors: [],
			list: [],
			person: '',
			personId: '',
		};
		this.getDictors();
	}

	changeDictor(name, id)
	{
		this.setState({person: name});
		this.setState({personId: id});
		console.log(this.state.person, this.state.personId);
	}

	getDictors = async () => {
		let response = await fetch('/persons', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let body = await response.json();
		this.setState({ dictors: body })  
		this.setState({ list: this.state.dictors.map((dictor, i) =>
                <li key={i}><button className="btn btn-dark" id={i} onClick={() => {this.changeDictor(dictor.name, dictor.nodeID)}}>{dictor.name}</button></li>
  		)});    
	}

	render() {  
		return (
			<div className="col-md-10">
				<div className="row">
					<div className="col-md-2"></div>
					<div className="col-md-4">
						<div className="card flex-md-row mb-4 box-shadow h-md-250">
			                <div className="card-body d-flex flex-column align-items-start">
								Диктор: <ul>{this.state.list}</ul>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="card flex-md-row mb-4 box-shadow h-md-250">
			                <div className="card-body d-flex flex-column align-items-start">
						        <form action="add_record" method="post" enctype="multipart/form-data">
								    <input type="file" id="file" name="filetoupload"/><br/>
								    <input type="text" id="text" name="text" value={this.state.personId}/><br/>
								    <input type="submit" /> 
								</form>
							</div>
						</div>
					</div>
					<div className="col-md-2"></div>
				</div>
			</div>
		);
    }
}

export default UploadForm;