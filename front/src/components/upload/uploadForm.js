import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Header from '../header.js';

class UploadForm extends React.Component {  
	constructor(props) {
		super(props);
	}

	render() {  
		return (
			<div className="container">
				<Header/>
				<div class="jumbotron" style={{borderRadius: "25px"}}>
			        <form action="fileupload" method="post" enctype="multipart/form-data">
					    <input type="file" id="file" name="filetoupload" onChange={this.changeFile} />
					    <input type="submit" /> 
					</form>
				</div>
		    </div>
		);
    }
}

export default UploadForm;