export const BASE_URL = "https://auth.nomoreparties.co";

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return res.json().then((data) => {
    throw new Error(console.log(data));
  });
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
    'Accept': 'application/json',
    "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
};

export const getContent = (jwt) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
  }).then(checkResponse);
};
