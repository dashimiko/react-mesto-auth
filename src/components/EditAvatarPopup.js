import {useEffect,useRef} from 'react';
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {

  const linkRef = useRef();

  useEffect(() => {
    linkRef.current.value = "";
  });

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: linkRef.current.value
    });
  }

  return (
    <PopupWithForm name="change-avatar" title="Обновить аватар" isOpen = {isOpen} onClose = {onClose} onSubmit={handleSubmit}>
      <label className="popup__profile-info">
        <input ref={linkRef} type="url" name = "avatar" id = "avatar" className = "popup__input popup__input_avatar" placeholder="Ссылка на картинку" required></input>
        <span className="avatar-error popup__error" id=""></span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
