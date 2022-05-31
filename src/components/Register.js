import {useState,useEffect} from 'react';
import * as MestoAuth from '../utils/MestoAuth'

function Register({ handleRegister }) {

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let { email, password } = userInfo;
    handleRegister({ email, password });
  };

  return (
    <section className="entry login">
      <div className="entry__container login__container">
        <h3 className="entry__title login__title">Регистрация</h3>
        <form className="entry__form login__form" onSubmit={handleSubmit}>
          <label className="entry__label login__label">
            <input name="email" className="entry__input entry__input_email login__input login__input_email" placeholder="Email"
            value={userInfo.email}
            onChange={handleChange}/>
            <span className="email-error popup__error"></span>
          </label>
          <label className="entry__label login__label">
            <input name="password" className="entry__input entry__input_password login__input login__input_password" placeholder="Пароль"
            value={userInfo.password}
            onChange={handleChange}/>
            <span className="password-error popup__error"></span>
          </label>
          <button className="entry__submit-button login__entry-button" type="submit">Зарегистрироваться</button>
          <a className="entry__login-link" href="/sign-in">Уже зарегистрированы? Войти</a>
        </form>
      </div>
    </section>
  );
}

export default Register;
