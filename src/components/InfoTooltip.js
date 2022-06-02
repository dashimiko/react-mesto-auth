import React from "react";
import completed from "../images/completed.png"
import failed from "../images/failed.png"

export default function InfoTooltip({isOpen, onClose, isEntrance}) {

  const completedText = "Вы успешно зарегистрировались!";
  const failedText = "Что-то пошло не так! Попробуйте еще раз.";

  return (
    <section className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button onClick={onClose} className="popup__close popup__close_new-place" type="button"></button>
        <img className="infoTooltip__pic" src={isEntrance ? completed : failed} alt={isEntrance ? completedText : failedText}></img>
        <p className="infoTooltip__title">{isEntrance ? completedText : failedText}</p>
      </div>
    </section>
  );
}
