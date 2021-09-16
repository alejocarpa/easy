import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

import Login from './../../../componentes/login/Login';

class Header extends Component {

  constructor(){
    super();

    this.state = {
      click : false
    }
  }

  handleClick = () => {
    this.setState({click: !this.state.click});
  }

  render() {

    return (
      <>
        <div className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              EASY <i className="fab fa-affiliatetheme" />
            </Link>
            <div className="menu-icon" onClick={this.handleClick}>
              <i className={this.state.click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <div className={this.state.click ? 'nav-menu active' : 'nav-menu'}>
              <div className="navbar-login">
                <Login />
              </div>
            </div>
            
          </div>
        </div>
      </>
    );
  }
}

export default Header;
