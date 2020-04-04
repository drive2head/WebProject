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
    this.init(); 
  }

  getOptions = async () =>
  {
    var response = await fetch('/records', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let body = await response.json();
    for (let i of body)
      this.options.push({value: i.name, label: i.name})
    this.forceUpdate();
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
	//this.renderTable();
  }

  renderTable()
  {
  	let table = '<br><table id="table" className="table table-dark"><thead><tr><th scope="col"></th>';
    table += '</tr></thead><tbody>';
    for (let i = 0; i < this.options.length; i++)
    {
		table += '<tr><th scope="row">' + (i) + '</th>';
		table += '<td>' + '<button className="btn btn-dark" onClick={this.handleClick}>' + this.options[i].value + '</button>' + '</td>';
		table += '</tr>';
	}
    table += '</tbody></table><br/>';
  	document.getElementById('table').innerHTML = table;
  }

  handleClick(event)
  {
  	const cookies = new Cookies();
	cookies.getAll();
	cookies.set('record', event.target.id, { path: '/' });
  	console.log("hey", );
  	window.location.href = "/get";
  }

  render() {  
    document.title = "Мои разметки";
    const listItems = this.options.map((d) => <li key={d.value}><button id={d.value} onClick={this.handleClick}>{d.value}</button></li>);
    console.log(this.options);
    return (
      <div className="container">
        <Header/>
        <div className="jumbotron" style={{borderRadius: "25px"}}>
        	{listItems}
        </div>
      </div>
    );
  }
}

export default ListInterface;