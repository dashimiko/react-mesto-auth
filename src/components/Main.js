import { useContext } from 'react';
import profileAddButton from '../images/small_add_button.svg';
import Card from './Card';

import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Main({cards,onEditProfile,onAddPlace,onEditAvatar,onCardClick,onCardLike,onCardDelete}){

  const currentUser = useContext(CurrentUserContext);

  return (

    <main>
      <section className="profile">
        <button className="profile__avatar-container" onClick={onEditAvatar}>
          <img className="profile__avatar" src={currentUser.avatar} alt ={currentUser.name}></img>
        </button>
        <div className="profile__info">
          <div className="profile__container">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button className="profile__edit-button" type="button" onClick={onEditProfile}></button>
          </div>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={onAddPlace}><img src={profileAddButton} className="profile__vector" alt="кнопка добавления контента"></img></button>
      </section>

      <section className="elements">
      {cards.map((card) => {
        return (
          <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>
          );
        })}
      </section>
    </main>
  );
}

export default Main;
