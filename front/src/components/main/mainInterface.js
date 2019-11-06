import React from 'react';
import Cookies from 'universal-cookie';

class MainInterface extends React.Component {
	constructor(props)
	{
		super(props);
	}

	logOut()
	{
		const cookies = new Cookies();
	    cookies.getAll();
	    cookies.remove('username');
	    window.location.href = "/";
	}

	render()
	{
		const isLoggedIn = this.props.loggedIn();
		return (
			isLoggedIn ? (
				<div className="App">
		    		<a href = "/post"> Post </a>
		    		<a href = "/get"> Get </a>
		    		<a href = "/person"> Person </a>
		    		<button onClick={this.logOut}>Logout</button>
		    	</div>
		    ) : (
		    	<div className="App">
		    		<a href = "/signin"> Sign in </a>
		    		<a href = "/signup"> Sign up </a>
		    	</div>
		    )
		);
	}
}

export default MainInterface;
