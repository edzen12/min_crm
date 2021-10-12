import jwtDecode from 'jwt-decode';
import LocalStorageService from './LocalStorageService';
import axios from 'axios';

export const authenticationService = {
  login,
  logout,
  getLoggedInUser,
  isUserAuth,
};

const localStorageService = LocalStorageService.getService();

function login(username, password) {
    return axios.post(`https://crm-academy.tk/api/token/`, {
    email: username,
    password
  })
    .then(response => {
      return response.data
    })
    .then(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      // localStorage.setItem('currentUser', JSON.stringify(user));
      localStorageService.setToken(user);
      return user;
    })
}

function logout() {
  // remove user from local storage to log user out
  // localStorage.removeItem('currentUser');
  localStorageService.clearToken();
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  window.location.replace('https://crm-academy.tk');
}

//  Returns the logged in user

export function getLoggedInUser() {
  // const cookies = new Cookies();
  // const user = cookies.get('user');
  let user = localStorage.getItem('currentUser');
  return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
};


// Checks if user is authenticated

function isUserAuth() {
  const user = getLoggedInUser();
  if (!user) {
    return false;
  }
  // ------------
  // return true;
  // -------------
  const decoded = jwtDecode(user.access);
  if (decoded) {
    return true;
  }
  return false;
  // const currentTime = Date.now() / 1000;
  // if (decoded.exp > currentTime) {
  //     return true;
  // } else {
  //     alert('access token expired');
  //     return false;
  // }
};