import {useState,useEffect} from 'react';
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [userData, setUserData] = useState('');
  const [InfoTooltipText, setInfoTooltipText] = useState('');
  const [cards, setCards] = useState([]);

  const history = useHistory();

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
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
  })}

  function handleUpdateUser({name,about}) {
    api.editProfile(name,about)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups()})
    .catch((err) => console.log(err))}

  function handleAddPlaceSubmit({name, link}) {
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
          setInfoTooltipText('Вы успешно зарегистрировались!')
        }})
      .catch((err) => {
        console.log(err);
        handleInfoTooltipPopupClick();
        setisEntranceCompleted(false);
        setInfoTooltipText('Что-то пошло не так! Попробуйте ещё раз.')
      })
    }

  const handleLogin = ({email, password}) => {
    return MestoAuth.authorize(email, password).then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        tokenCheck()
      }})
      .catch((err) => {
        console.log(err);
        handleInfoTooltipPopupClick();
        setisEntranceCompleted(false);
        setInfoTooltipText('Что-то пошло не так! Попробуйте ещё раз.')
      })
    }

  const tokenCheck = () => {
    const token = localStorage.getItem('token')
    if(token) {
      MestoAuth.getContent(token).then((res) => {
        setUserData(res.data.email)
        setLoggedIn(true)
        history.push('/')
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  useEffect(() => {
    tokenCheck();
  }, []);

  const signOut = () => {
    localStorage.removeItem('token')
    setUserData('');
    setLoggedIn(false);
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

      <InfoTooltip onClose={closeAllPopups} isEntrance={isEntranceCompleted} isOpen={isInfoTooltipPopupOpen} text={InfoTooltipText}/>

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
