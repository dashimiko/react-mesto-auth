import React, {useState,useEffect} from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';

import {api} from '../utils/Api'
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {Route, Switch, Redirect,Link} from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip.js';

import * as MestoAuth from '../utils/MestoAuth'
import { useHistory } from "react-router-dom";


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);

  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [UserTooltipInfo, setUserTooltipInfo] = useState({ url: "", title: "" });

  const history = useHistory();

  useEffect(() => {
    Promise.all([api.getProfile(), api.getInitialCards()])
      .then(([profileData, card]) => {
        setCurrentUser(profileData);
        setCards(card);
      }).catch((err) => console.log(err))
    },[]);

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

    const handleRegister = ({ email, password }) => {
      return MestoAuth.register(email, password).then(() => {
        history.push('/sign-in');
      });
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
      <Switch>

      <Route path="/sign-in">
        <Header>
          <a className ="header__link" href="/sign-up">Регистрация</a>
        </Header>
        <Login  />
      </Route>

      <Route path="/sign-up">
        <Header>
          <a className ="header__link" href="/sign-in">Войти</a>
        </Header>
        <Register handleRegister={handleRegister} />
      </Route>

      <ProtectedRoute exact path="/" loggedIn={loggedIn}>
        <Header />
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

      <InfoTooltip
      onClose={closeAllPopups}
      data={UserTooltipInfo}
      isOpen={isInfoTooltipPopupOpen}/>

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
