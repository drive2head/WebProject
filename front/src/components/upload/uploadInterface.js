import React from 'react';
import Header from '../header.js';
import axios from "axios";
import Cookies from 'universal-cookie';
import UploadForm from './uploadForm.js';

let entity = require("./../../model.js")

class UploadInterface extends React.Component {  
	constructor(props) {
		super(props);
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