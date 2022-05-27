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

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

      <Header />
      <Main
      cards={cards}
      onEditProfile={handleEditProfileClick}
      onAddPlace={handleAddPlaceClick}
      onEditAvatar={handleEditAvatarClick}
      onCardClick = {handleCardClick}
      onCardLike = {handleCardLike}
      onCardDelete= {handleCardDelete}
      />

      <Footer />

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
