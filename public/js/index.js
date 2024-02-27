<<<<<<< HEAD
console.log('hello from parcel');
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-undef */

=======
>>>>>>> aa266424bd1a33894d18d15bb2a47284fed78268
import '@babel/polyfill';
import { login } from './login';
import { displayMap } from './mapbox';

<<<<<<< HEAD
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
=======
const locations = JSON.parse(document.getElementById('map').dataset.locations);

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
>>>>>>> aa266424bd1a33894d18d15bb2a47284fed78268
