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
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/get">Get</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/post">Post</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/person">Person</a>
                        </li>
                    </ul>
                </div>
                <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
                    <ul class="navbar-nav ml-auto">
                        <li><button onClick={this.logOut}>Logout</button></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Header;