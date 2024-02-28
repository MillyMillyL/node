/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-undef */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');

//delegation
if (loginForm) {
  //values

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
