import React, {useState,useEffect} from 'react';
import {Route, Switch, Redirect, Link, useHistory} from 'react-router-dom';

import {api} from '../utils/Api'
import * as MestoAuth from '../utils/MestoAuth'

import {CurrentUserContext} from "../contexts/CurrentUserContext";

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';

import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip.js';


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isEntranceCompleted, setisEntranceCompleted] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);

  /*const [UserTooltipInfo, setUserTooltipInfo] = useState({ url: "", title: "" });*/

  /*const [UserTooltipInfo, setUserTooltipInfo] = useState(null);*/

  const history = useHistory();

  const [userData, setUserData] = useState('');

  useEffect(() => {
    if (loggedIn) {
    Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([userData, card]) => {
        setCurrentUser(userData);
        setCards(card);
      }).catch((err) => console.log(err))
    }},[loggedIn]);

  function handleEditAvatarClick () {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick () {
    setIsEditProfilePopupOpen(true);
  }

  function handleInfoTooltipPopupClick () {
    setIsInfoTooltipPopupOpen(true)
  }

  function handleAddPlaceClick () {
    setIsAddPlacePopupOpen(true)
  }

  function handleCardClick (card) {
    setSelectedCard(card)
  }

  function closeAllPopups () {
    setIsEditProfilePopupOpen(null);
    setIsAddPlacePopupOpen(null);
    setIsEditAvatarPopupOpen(null);
    setIsInfoTooltipPopupOpen(null)
    setSelectedCard(null)
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
  })}

  function handleUpdateUser({name,about}) {
    api.editProfile(name,about)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups()})
    .catch((err) => console.log(err))}

  function handleAddPlaceSubmit({ name, link }) {
    api.addImage(name, link)
    .then(newCard => {
      setCards([newCard, ...cards]);
      closeAllPopups()})
    .catch((err) => console.log(err))}

  function handleUpdateAvatar({avatar}) {
    api.editAvatar(avatar)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups()})
    .catch((err) => console.log(err))}

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {setCards((state) => state.filter((с) => с._id !== card._id))})
    .catch((err) => console.log(err))}

  const handleRegister = ({email, password}) => {
    return MestoAuth.register(email, password)
      .then((res) => {
        if (res) {
          handleInfoTooltipPopupClick();
          history.push("/sign-in");
          setisEntranceCompleted(true);
        }})
      .catch((err) => {
        console.log(err);
        handleInfoTooltipPopupClick();
        setisEntranceCompleted(false);
      })
    }

  const handleLogin = ({ email, password }) => {
    return MestoAuth.authorize(email, password).then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        tokenCheck()
        console.log('успех')
      }})
    }

  const tokenCheck = () => {
    const token = localStorage.getItem('token')
    if(token) {
      MestoAuth.getContent(token).then((res) => {
        setUserData(res.data.email)
        setLoggedIn(true)
        history.push('/')
        console.log('успех')
      })
    }
  }

  /*useEffect(() => {
    tokenCheck();
  }, []);*/

  const signOut = () => {
    localStorage.removeItem('token')
    setLoggedIn(false);
    setUserData('');
    history.push('/sign-in');
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
      <Switch>

      <Route path="/sign-in">
        <Header>
          <Link to="/sign-up" className ="header__link">Регистрация</Link>
        </Header>
        <Login handleLogin={handleLogin} tokenCheck={tokenCheck}/>
      </Route>

      <Route path="/sign-up">
        <Header>
          <Link to="/sign-in" className ="header__link">Войти</Link>
        </Header>
        <Register handleRegister={handleRegister} />
      </Route>

      <ProtectedRoute exact path="/" loggedIn={loggedIn}>
        <Header onClick={signOut} userData={userData}>
          <div className ="header__user-container">
            <p className ="header__link header__email">{userData}</p>
            <Link to="/sign-in" className ="header__link">Выйти</Link>
          </div>
        </Header>
        <Main
        cards={cards}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        onEditAvatar={handleEditAvatarClick}
        onCardClick = {handleCardClick}
        onCardLike = {handleCardLike}
        onCardDelete = {handleCardDelete}/>
        <Footer />
      </ProtectedRoute>

      <Route  path="/">
        {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
      </Route>

      </Switch>

      <InfoTooltip onClose={closeAllPopups} isEntrance={isEntranceCompleted} isOpen={isInfoTooltipPopupOpen}/>

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddPlaceSubmit}/>

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>

      <PopupWithForm name="delete" title="Вы уверены?">
        <label className="popup__profile-info">
          <input type="url" name = "avatar" id = "avatar" className = "popup__input popup__input_avatar" placeholder="Ссылка на картинку" required></input>
          <span className="avatar-error popup__error" id=""></span>
        </label>
      </PopupWithForm>

      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

      </div>

    </CurrentUserContext.Provider>
  );
}

export default App;
