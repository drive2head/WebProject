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
		document.title = "Новая аудиозапись";
		return (
			<div className="container">
				<Header/>
				<div className="jumbotron" style={{borderRadius: "25px"}}>
					<UploadForm/>
				</div>
		    </div>
		);
    }
}

export default UploadInterface;