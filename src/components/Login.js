import {useState} from 'react';

const Login = (props) => {
  const [formParams, setFormParams] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormParams((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formParams.email || !formParams.password){
      return;
    }
    props.handleLogin({email: formParams.email, password: formParams.password})
  }

  return (
    <section className="entry login">
      <div className="entry__container login__container">
        <h3 className="entry__title login__title">Вход</h3>
        <form className="entry__form login__form" onSubmit={handleSubmit}>
          <label className="entry__label login__label">
            <input name ="email" className="entry__input entry__input_email login__input login__input_email" placeholder="Email" value={formParams.email} onChange={handleChange}/>
            <span className="email-error popup__error"></span>
          </label>
          <label className="entry__label login__label">
            <input type="password" name ="password" className="entry__input entry__input_password login__input login__input_password" placeholder="Пароль" value={formParams.password} onChange={handleChange}/>
            <span className="password-error popup__error"></span>
          </label>
          <button className="entry__submit-button login__entry-button" type="submit">Войти</button>
        </form>
      </div>
    </section>
    );
}

export default Login;
