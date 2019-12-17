import React from 'react';
import Header from '../header.js';
import axios from "axios";
import Cookies from 'universal-cookie';
import DictorInfo from './dictorInfo.js';

let entity = require("./../../model.js")

class DictorInterface extends React.Component {  
	constructor(props) {
		super(props);
		this.state = {  
			dictorName: "",
			dictorLang: "",
			dictorCity: "",
			dictorSex: "",
			dictorAge: "",
			dictorCountry: "",
			selectedOptions: [],
			dictorPseudo: "",
	    };
	}

	saveDictor()
	{
		let dictor = entity.Person(this.state.dictorName, this.state.dictorLang, this.state.dictorCity, this.state.dictorSex, this.state.dictorAge, this.state.selectedOptions);

		axios.post('/add_person', {
			person: dictor,
			pseudonym: this.state.dictorPseudo,
		});
		window.alert('Done!');
	}

	handleInputChange(event) {this.setState({[event.target.name]: event.target.value});}
  	changeSelected(selectedOpts){this.setState({selectedOptions: selectedOpts});}

	render() {  
		return (
			<div className="container">
				<Header/>
				<div className="jumbotron" style={{borderRadius: "25px"}}>
					<div className="row">
						<DictorInfo
							handleInputChange={this.handleInputChange.bind(this)}
							changeSelected={this.changeSelected.bind(this)}
							saveDictor={this.saveDictor.bind(this)}
						/>
					</div>
				</div>
		    </div>
		);
    }
}

export default DictorInterface;