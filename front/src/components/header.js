import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import Cookies from 'universal-cookie';

class Header extends React.Component {  
    constructor(props) {
        super(props);
    }

    logOut()
    {
        const cookies = new Cookies();
        cookies.getAll();
        cookies.remove('username');
        cookies.remove('password');
        window.location.href = "/";
    }

    render() {  
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{borderRadius: "10px"}}>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Главная</a>
                        </li>
                        {/*  <li className="nav-item">
                            <a className="nav-link" href="/get">Посмотреть разметки</a>
                        </li> */}
                        <li className="nav-item">
                            <a className="nav-link" href="/post">Добавить</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/profile">Профиль</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/upload">Загрузить</a>
                        </li>
                    </ul>
                </div>
                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                    <ul className="navbar-nav ml-auto">
                        <li><button onClick={this.logOut}>Выйти</button></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Header;