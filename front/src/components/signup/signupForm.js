import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

class SignupForm extends React.Component {  
	constructor(props) {
		super(props);
	}

	render() {  
		return (
			<div className="d-flex justify-content-center h-100">
		        <div className="card">
		        	<div className="card-header">
			            <h3 style={{display: 'inline'}}>Регистрация</h3>
		          	</div>
		          	<div className="card-body">
		          		<div className="input-group form-group">
			              	<div className="input-group-prepend">
			                	<span className="input-group-text"><i className="fa fa-user"></i></span>
			              	</div>
			          		<input name="name" type="text" className="form-control" onChange={this.props.handleInputChange} placeholder="Имя"/>
			        	</div>
		        		<div className="input-group form-group">
			              	<div className="input-group-prepend">
			                	<span className="input-group-text"><i className="fa fa-user"></i></span>
			              	</div>
		          			<input name="surname" type="text" className="form-control" onChange={this.props.handleInputChange} placeholder="Фамилия"/>
		        		</div>
			            <div className="input-group form-group">
			              	<div className="input-group-prepend">
			                	<span className="input-group-text"><i className="fa fa-user"></i></span>
			              	</div>
		          			<input name="username" type="text" className="form-control" onChange={this.props.handleInputChange} placeholder="Логин"/>
		        		</div>
		            	<div className="input-group form-group">
		              		<div className="input-group-prepend">
		                		<span className="input-group-text"><i className="fa fa-key"></i></span>
		              		</div>
		              		<input name="password" type="password" className="form-control" onChange={this.props.handleInputChange} placeholder="Пароль"/>
		            	</div>
		           		<div className="form-group">
		              		<button onClick={this.props.signUp} className="btn float-right btn-danger">Зарегистрироваться</button>
		           		</div>
		          	</div>
		        </div>
		    </div>
		);
    }
}

export default SignupForm;