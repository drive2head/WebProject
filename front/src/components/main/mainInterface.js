import React from 'react';

class MainInterface extends React.Component {
	constructor(props)
	{
		super(props);
	}

	render()
	{
		const isLoggedIn = true;
		return (
	    	<div className="App">
	    		<a href = "/post"> Post </a>
	    	</div>
		);
	}
}

export default MainInterface;
