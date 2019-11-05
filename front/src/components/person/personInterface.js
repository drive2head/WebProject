import React from 'react';
import Cookies from 'universal-cookie';
import PersonForm from './personForm.js';

class PersonInterface extends React.Component {
	constructor(props)
	{
		super(props);
		this.getUser();
		this.state={ username: "", password: "", name: "", surname: ""};
	}

	getUser = async () => {
		const cookies = new Cookies();
    	cookies.getAll();
    	console.log(cookies.cookies);
		var response = await fetch('/person', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: cookies.cookies.username,
				password: cookies.cookies.password,
			})
		});

		var body = await response.json();

		if (body == false)
			alert('Bad data, FILOLUX!');
		else
		{
			this.setState({ username: body.username, password: body.password, name: body.name, surname: body.surname })      
		}
	}

	render()
	{
		const isLoggedIn = this.props.loggedIn();
		return (
			isLoggedIn ? (
				<div className="App">
		    		<PersonForm state={this.state} />
		    	</div>
		    ) : (
		    	<div className="App">
		    		<a href = "/signin"> Login </a>
		    	</div>
		    )
		);
	}
}

export default PersonInterface;
