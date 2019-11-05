import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

class LoginForm extends React.Component {  
	constructor(props) {
		super(props);
	}

	render() {  
		return (
			<div className="d-flex justify-content-center h-100">
		        <div className="card">
		          	<div className="card-header">
			            <h3 style={{display: 'inline'}}>Sign In</h3>
		          	</div>
		          	<div className="card-body">
			            <div className="input-group form-group">
			              	<div className="input-group-prepend">
			                	<span className="input-group-text"><i className="fa fa-user"></i></span>
			              	</div>
		          			<input name="username" type="text" className="form-control" onChange={this.props.handleInputChange} placeholder="username"/>
		        		</div>
		            	<div className="input-group form-group">
		              		<div className="input-group-prepend">
		                		<span className="input-group-text"><i className="fa fa-key"></i></span>
		              		</div>
		              		<input name="password" type="password" className="form-control" onChange={this.props.handleInputChange} placeholder="password"/>
		            	</div>
		            	<div className="form-group">
		              		<button onClick={this.props.signIn} className="btn float-right login_btn">Sign in</button>
		           		</div>
		           		<div className="form-group">
		              		<button onClick={this.props.signUp} className="btn float-right login_btn">Sign up</button>
		           		</div>
		          	</div>
		        </div>
		    </div>
		);
    }
}

export default LoginForm;