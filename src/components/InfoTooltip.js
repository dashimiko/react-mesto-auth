import React from "react";
import completed from "../images/completed.png"
import failed from "../images/failed.png"

export default function InfoTooltip({isOpen, onClose, isEntrance, text}) {
  return (
    <section className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container infoTooltip__container">
        <button onClick={onClose} className="popup__close popup__close_new-place" type="button"></button>
        <div className="infoTooltip__box">
          <img className="infoTooltip__pic" src={isEntrance ? completed : failed} alt={text}></img>
          <p className="infoTooltip__title">{text}</p>
        </div>
      </div>
    </section>
  );
}
