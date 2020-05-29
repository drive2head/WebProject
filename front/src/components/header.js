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
            <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow-lg" style={{borderRadius: "20px"}}>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="badge nav-link" href="/"><button className="btn btn-default btn-sm btn3d">Главная страница</button></a>
                        </li>
                        <li className="nav-item">
                            <a className="badge nav-link" href="/list"><button className="btn btn-default btn-sm btn3d">Просмотр разметок</button></a>
                        </li>
                        <li className="nav-item">
                            <a className="badge nav-link" href="/post"><button className="btn btn-default btn-sm btn3d">Добавить разметку</button></a>
                        </li>
                        <li className="nav-item">
                            <a className="badge nav-link" href="/upload"><button className="btn btn-default btn-sm btn3d">Добавить аудиозапись</button></a>
                        </li>
                        <li className="nav-item">
                            <a className="badge nav-link" href="/add_dictor"><button className="btn btn-default btn-sm btn3d">Добавить диктора</button></a>
                        </li>
                        <li className="nav-item">
                            <a className="badge nav-link" href="/profile"><button className="btn btn-default btn-sm btn3d">Профиль</button></a>
                        </li>
                        <li className="nav-item">
                            <a className="badge nav-link" href="https://www.youtube.com/watch?v=I03xFqbxUp8" target="blank"><h4>Как тебе редизайн?</h4></a>
                        </li>
                    </ul>
                </div>
                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                    <ul className="navbar-nav ml-auto">
                        <li><button className="btn btn-danger btn-sm btn3d" onClick={this.logOut}>Выйти</button></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Header;
