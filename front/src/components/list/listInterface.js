import React from 'react';
import axios from "axios";
import Header from '../header.js';
import Cookies from 'universal-cookie';

let entity = require("./../../model.js")

class ListInterface extends React.Component {  
  constructor(props)
  {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.options = [];
  }

  getOptions = async () =>
  {
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

    let body = await response.json();
    console.log('BODY: ', body);
    if (body.status) {
      for (let i of body.output)
        this.options.push({value: i, label: i})
      this.forceUpdate();
    } else {
      alert('Произошла ошибка на сервере при загрузке разметок');
    }
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
  	await(this.getOptions());
  	const cookies = new Cookies();
  	cookies.getAll();
  	for(let i of this.options)
  	{
  		let response = await fetch('/get_data', {
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/json'
  			},
  			body: JSON.stringify({
  				record: i.value,
  				username: cookies.cookies.username,
  			})
  		});

  		let body = await response.json();
  		if (body == false)
  			alert('Bad data, FILOLUX!');
  		else
  		{
  			console.log(body);
  		}
  	}
  }

  handleClick(event)
  {
  	const cookies = new Cookies();
    cookies.getAll();
    cookies.set('record', event.target.id, { path: '/' });
  	console.log("hey", );
  	window.location.href = "/get";
  }

  deletePlease = async (event) =>
  {
    const cookies = new Cookies();
    cookies.getAll();
    let response = await fetch('/remove_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        record: event.target.id,
        username: cookies.cookies.username,
      })
    });
    let body = await response.json();
    window.location.href = "/list";
  }

  render() {  
    document.title = "Мои разметки";
    const listItems = this.options.map((d) => <li key={d.value}><button className="btn btn-info btn-lg btn3d" id={d.value} onClick={this.handleClick}>{d.value}</button><button className="btn btn-danger btn-lg btn3d" id={d.value} onClick={this.deletePlease}>Удалить</button><img src={require('../kek.gif')} alt="Logo" style={{width: "100px"}} /></li>);
    console.log(this.options);
    return (
      <div className="container-fluid">
        <Header/>
        <div className="jumbotron" style={{borderRadius: "25px"}}>
        	{listItems}
        </div>
      </div>
    );
  }
}

export default ListInterface;