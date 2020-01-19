import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

class PersonForm extends React.Component {  
	constructor(props) {
		super(props);
	}

	render() {  
		return (
			<div>
				<div className="input-group form-group">
			      	<div className="input-group-prepend">
			        	<span className="input-group-text"><i className="fa fa-user"></i></span>
			      	</div>
						<input name="name" type="text" className="form-control" onChange={this.props.handleInputChange} value={this.props.state.name} />
				</div>
				<div className="input-group form-group">
			      	<div className="input-group-prepend">
			        	<span className="input-group-text"><i className="fa fa-user"></i></span>
			      	</div>
						<input name="surname" type="text" className="form-control" onChange={this.props.handleInputChange} value={this.props.state.surname} />
				</div>
			    <div className="input-group form-group">
			      	<div className="input-group-prepend">
			        	<span className="input-group-text"><i className="fa fa-user"></i></span>
			      	</div>
						<input name="username" type="text" className="form-control" onChange={this.props.handleInputChange} value={this.props.state.username} />
				</div>
				<div className="input-group form-group">
			  		<div className="input-group-prepend">
			    		<span className="input-group-text"><i className="fa fa-key"></i></span>
			  		</div>
			  		<input name="password" type="password" className="form-control" onChange={this.props.handleInputChange} value={this.props.state.password} />
				</div>
			</div>
		);
    }
}

export default PersonForm;





