import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Header from '../header.js';
import Select from 'react-select';

class UploadForm extends React.Component {  
	constructor(props) {
		super(props);
		this.changeDictor = this.changeDictor.bind(this);
		this.state = {  
			person: '',
			personId: '',
			selected: '',
		};
		this.options = [];
		this.getDictors();
	}

	changeDictor(name, id)
	{
		this.setState({person: name});
		this.setState({personId: id});
	}

	renderSelect()
	{
		return (
			<Select
		    	autoFocus={false}
		    	id="sounds"
		    	name="Фонемы"
		    	options={this.options}
		    	openMenuOnFocus
		    	closeMenuOnSelect={true}
		    	value={this.state.person}
		    	onChange={
		      		(selectedOpt) => {
		        		this.setState({person: selectedOpt.name});
						this.setState({personId: selectedOpt.id});
		      		}
		    	}
		  	/>
		);
	}

	getDictors = async () => {
		let response = await fetch('/persons', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let body = await response.json();
		console.log(body);
		for (let i = 0; i < body.length; i++)
			this.options.push({id: body[i]._id, label: body[i].name});
 	}

	render() {  
		return (
			<div className="col-md-12">
				<div className="row">
					<div className="col-md-1"></div>
					<div className="col-md-5">
						<div className="card flex-md-row mb-4 box-shadow h-md-250">
			                <div className="card-body d-flex flex-column align-items-start">
								Диктор:
								<div id="select" style={{width: '100%'}}>
					            	{this.renderSelect()}
					            </div>
							</div>
						</div>
					</div>
					<div className="col-md-5">
						<div className="card flex-md-row mb-4 box-shadow h-md-250">
			                <div className="card-body d-flex flex-column align-items-start">
						        <form action="add_record" method="post" enctype="multipart/form-data">
						        	<input type="text" id="text" name="text" value={this.state.personId} style={{width: '100%'}}/><br/>
								    <br/><input type="file" id="file" name="filetoupload"/><br/>
								    <br/><input className="btn btn-dark" type="submit" /> 
								</form>
							</div>
						</div>
					</div>
					<div className="col-md-1"></div>
				</div>
			</div>
		);
    }
}

export default UploadForm;