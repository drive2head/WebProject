import React from 'react';
import Header from '../header.js';

class MainInterface extends React.Component {
	constructor(props)
	{
		super(props);
	}

	render()
        {
                document.title = "Главная";
                return (
                        <div className="container">
                                <Header/>
                                <div class="jumbotron" style={{borderRadius: "25px"}}>
                                <p align="center">
                        <a target="_blank" href="https://docs.google.com/document/d/1SK7MEiPkzkByWT9t2xKzj7N7jvfkW6CWIhIYS50XLsU/edit?usp=sharing"> Инструкция для разметки аудиозаписи </a>
                        </p>
                        </div>

                </div>

                );
        }
}

export default MainInterface;
