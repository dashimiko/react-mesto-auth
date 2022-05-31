import React from 'react';
import logo from '../images/logo_header.svg';

function Header({children}) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип проекта 'Меcто'."></img>
      {children}
    </header>
  );
}

export default Header;
