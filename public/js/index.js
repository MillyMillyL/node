console.log('hello from parcel');
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-undef */

// import '@babel/polyfill';
import { login } from './login';
import { displayMap } from './mapbox';

//DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

//values
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

//delegation
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    login(email, password);
  });
}

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
