import {useState,useContext,useEffect} from 'react';
import PopupWithForm from "./PopupWithForm";

import {CurrentUserContext} from "../contexts/CurrentUserContext.js";

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {

  const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  const handleNameInput = (e) => {
    e.preventDefault();
    setName(e.target.value)
  }

  const handleDescriptionInput = (e) => {
    e.preventDefault();
    setDescription(e.target.value)
  }

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser,isOpen]);

  return (
    <PopupWithForm name="edit-profile" title="Редактировать профиль" isOpen = {isOpen} onClose = {onClose} onSubmit={handleSubmit}>
        <label className="popup__profile-info">
          <input onChange={handleNameInput} value={name || ''} type="text" id="username" className="popup__input popup__input_edit_name" name ="name" placeholder="Имя" required></input>
          <span className="username-error popup__error" id=""></span>
        </label>
        <label className="popup__profile-info">
          <input onChange={handleDescriptionInput} value={description || ''} type="text" id = "description" className = "popup__input popup__input_edit_description" name = "about" placeholder="О себе" required></input>
          <span className="description-error popup__error" id=""></span>
        </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
