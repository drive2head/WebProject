import React from 'react';
import Cookies from 'universal-cookie';
import PersonForm from './personForm.js';
import PersonPhonemes from './personPhonemes.js';
import Header from '../header.js';

class PersonInterface extends React.Component {
	constructor(props)
	{
		super(props);
		this.getUser();
		this.getMarkups();
		this.state={ username: "", password: "", name: "", surname: "", markups: {}};
	}
	/**
	    * Функция заполняет список разметок пользователя.
	*/
	getMarkups = async () => {
		const cookies = new Cookies();
    	cookies.getAll();
		let response = await fetch('/markups', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: cookies.cookies.username,
			})
		});

		let body = await response.json(); // отправляет запрос с undefined username/password 
		if (body == false)
			alert('Bad data, FILOLUX!');
		else
		{
			if (body.completed) {
				let tmp = body.output;
				let result = [];
				for (let i of body.output)
					result.push({value: i, label: i});
				this.setState({ markups: result });
			} else {
				alert('Произошла ошибка на сервере при загрузке разметок');
			}
		}
	}
	/**
		* Функция получает информацию о пользователе (профиль).
	*/
	getUser = async () => {
		const cookies = new Cookies();
    	cookies.getAll();
		let response = await fetch('/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: cookies.cookies.username,
				password: cookies.cookies.password,
			})
		});

		let body = await response.json(); // отправляет запрос с undefined username/password 
		if (body == false)
			alert('Bad data, FILOLUX!');
		else
		{
			this.setState({ username: body.username, password: body.password, name: body.name, surname: body.surname })      
		}
	}
	/**
	    * Функция запускает редактирование выбранной разметки. Производит редирект на страницу редактирования.
	    * @param {string} a название аудиозаписи, для которой необходимо изменить разметку.
	*/
	changeMarkup(a)
	{
		const cookies = new Cookies();
		console.log(a);
		cookies.set('record', a.label, { path: '/' });
		window.location.href = "/get";
	}

	render()
	{
		return (
			<div className="container-fluid">
				<Header/>
				<div className="jumbotron" style={{borderRadius: "25px"}}>
		    		<PersonForm state={this.state} />
		    		<div className="row">
		   				<div className="col-md-3"></div>
					    <div className="col-md-8 ">
		    				<PersonPhonemes markups={this.state.markups}
		    				changeMarkup={this.changeMarkup.bind(this)} />
		    			</div>
		    			<div className="col-md-1"></div>
		    		</div>
		    	</div>
	    	</div>
		);
	}
}

export default PersonInterface;
