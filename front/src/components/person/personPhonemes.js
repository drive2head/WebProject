import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Select from 'react-select';

class PersonPhonemes extends React.Component {  
	constructor(props) {
		super(props);
		this.state = {value: ''};
	}

	renderMarkups()
	{
		console.log(this.props.markups);
		return (
			<Select
		        autoFocus={false}
		        id="sounds"
		        name="Фонемы"
		        options={this.props.markups}
		        openMenuOnFocus
		        closeMenuOnSelect={true}
		        value={this.state.value}
		        onChange={
			        (selectedOpt) => {
			            this.props.changeMarkup(selectedOpt);
			            this.setState({value: selectedOpt});
			        }
		        }
		    />
		);
	}

	render() {  
		return (
			<div id="select">
			    {this.renderMarkups()}
			</div>
		);
    }
}

export default PersonPhonemes;





