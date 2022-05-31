import React from 'react';

function Login() {
  return (
  <section className="entry login">
    <div className="entry__container login__container">
      <h3 className="entry__title login__title">Вход</h3>
      <form className="entry__form login__form">
        <label className="entry__label login__label">
          <input className="entry__input entry__input_email login__input login__input_email" placeholder="Email"/>
          <span className="email-error popup__error"></span>
        </label>
        <label className="entry__label login__label">
          <input className="entry__input entry__input_password login__input login__input_password" placeholder="Пароль"/>
          <span className="password-error popup__error"></span>
        </label>
        <button className="entry__submit-button login__entry-button" type="submit">Войти</button>
      </form>
    </div>
  </section>
  );
}

export default Login;


