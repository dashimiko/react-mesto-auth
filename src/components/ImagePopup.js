import React from 'react';

function ImagePopup({card,onClose}) {
  return (
    <section className={`popup ${card && 'popup_opened'}`}>
      <div className="popup__picture-container">
        <figure className="popup__figure">
          <img src={`${card && card.link}`} className="popup__picture" alt={`${card && card.name}`}></img>
          <figcaption className="popup__description">{`${card && card.name}`}</figcaption>
        </figure>
        <button type="button" className="popup__close popup__close_open-picture" onClick={onClose}></button>
      </div>
    </section>
  );
}

export default ImagePopup;
