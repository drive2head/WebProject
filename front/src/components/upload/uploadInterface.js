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
			dictors: [],
		};
		this.getDictors();
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
		this.setState({ dictors: body })  
		console.log(this.state);    
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