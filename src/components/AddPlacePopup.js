import {useState,useEffect} from 'react';
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({isOpen, onClose, onAddCard}) {

  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAddCard({
      name,
      link,
    });
  }

  const handleNameInput = (e) => {
    e.preventDefault();
    setName(e.target.value)
  }

  const handleLinkInput = (e) => {
    e.preventDefault();
    setLink(e.target.value)
  }

  useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  return (
    <PopupWithForm name="new-place" title="Новое место" isOpen = {isOpen} onClose = {onClose} onSubmit={handleSubmit}>
        <label className="popup__profile-info">
          <input onChange={handleNameInput} value ={name} id = 'place' name = "place" type="text" className="popup__input popup__input_place_name" placeholder="Название" required></input>
          <span className="place-error popup__error" id=""></span>
        </label>
        <label className="popup__profile-info">
          <input onChange={handleLinkInput} value ={link} type="url" name = "link" id = "link" className = "popup__input popup__input_place_link" placeholder="Ссылка на картинку" required></input>
          <span className="link-error popup__error" id=""></span>
        </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
