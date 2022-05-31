import React from "react";

export default function InfoTooltip({isOpen, onClose, data}) {
  return (
    <section className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button onClick={onClose} className="popup__close popup__close_new-place" type="button"></button>
        <img className="infoTooltip__pic" src={data.url} alt={data.title}></img>
        <p className="infoTooltip__title">{data.title}</p>
      </div>
    </section>
  );
}
