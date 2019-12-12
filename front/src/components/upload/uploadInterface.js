import React from 'react';
import Header from '../header.js';
import axios from "axios";
import Cookies from 'universal-cookie';
import UploadForm from './uploadForm.js';

let entity = require("./../../model.js")

class UploadInterface extends React.Component {  
	constructor(props) {
		super(props);
		this.state = {  
			dictorName: "",
			dictorLang: "",
			dictorCity: "",
			dictorSex: "",
			dictorAge: "",
			dictorCountry: "",
			dictorAccent: "",
			selectedOptions: [],
	    };
	}

	handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}
  	changeSelected(selectedOpts){this.setState({selectedOptions: selectedOpts});}

	saveTrack()
	{
		let person = entity.Person(
		  this.state.dictorName,
		  this.state.dictorAge,
		  this.state.dictorSex,
		  this.state.dictorLang,
		  this.state.dictorCity,
		  this.state.dictorCountry,
		  this.state.selectedOptions,
		);
		let record_path = document.getElementById('file').value.split('\\');
		const recname = record_path[record_path.length - 1];
		let record = entity.Record(
		  recname,
		  {},
		);
		const cookies = new Cookies();
		cookies.getAll();
		axios.post('/add_track', {
		  username: cookies.cookies.username,
		  person: person,
		  record: record,
		});
		window.alert('Done!');
		//window.location.href = "/get";
	}

	render() {  
		return (
			<div className="container">
				<Header/>
				<div className="jumbotron" style={{borderRadius: "25px"}}>
					<div className="row">
						<UploadForm/>
					</div>
				</div>
		    </div>
		);
    }
}

export default UploadInterface;