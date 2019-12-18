import React from 'react';
import Header from '../header.js';

class GetInterface extends React.Component {
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return (
			<div className="container">
				<Header/>
				<div class="jumbotron" style={{borderRadius: "25px"}}>
					<p class="text-justify">No API</p>
				</div>
			</div>

		);
	}
}

export default GetInterface;