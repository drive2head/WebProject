import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Header from '../header.js';

class UploadForm extends React.Component {  
	constructor(props) {
		super(props);
	}

	render() {  
		return (
			<div className="col-md-6">
		        <form action="fileupload" method="post" enctype="multipart/form-data">
				    <input type="file" id="file" name="filetoupload"/>
				    <input type="text" id="name" name="name"/>
				    <input type="submit" /> 
				</form>
			</div>
		);
    }
}

export default UploadForm;