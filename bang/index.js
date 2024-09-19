const colt = new Audio('./sounds/standart.mp3');
const lema = new Audio('./sounds/lema.mp3');
const volcanic = new Audio('./sounds/volcanic.mp3');
const shotgun = new Audio('./sounds/shotgun.mp3');
const remington = new Audio('./sounds/remington.mp3');
const carbine = new Audio('./sounds/carbine.mp3');
const winchester = new Audio('./sounds/winchester.mp3');

document.querySelector('.cards__container_weapons').addEventListener('click', (event) => {
  if (event.target.classList.contains('js-colt') || event.target.closest('.js-colt')) {
    colt.play();
  } else if (event.target.classList.contains('js-lema') || event.target.closest('.js-lema')) {
    lema.play();
  } else if (event.target.classList.contains('js-volcanic') || event.target.closest('.js-volcanic')) {
    volcanic.play();
  } else if (event.target.classList.contains('js-shotgun') || event.target.closest('.js-shotgun')) {
    shotgun.play();
  } else if (event.target.classList.contains('js-remington') || event.target.closest('.js-remington')) {
    remington.play();
  } else if (event.target.classList.contains('js-carbine') || event.target.closest('.js-carbine')) {
    carbine.play();
  } else if (event.target.classList.contains('js-winchester') || event.target.closest('.js-winchester')) {
    winchester.play();
  }
});


const miss = new Audio('./sounds/miss.mp3');
const beer = new Audio('./sounds/beer.mp3');

document.querySelector('.cards__container_missing').addEventListener('click', (event) => {
  if (event.target.classList.contains('js-miss') || event.target.closest('.js-miss')) {
    miss.play();
  } else if (event.target.classList.contains('js-beer') || event.target.closest('.js-beer')) {
    beer.play();
  }
});


const beauty = new Audio('./sounds/beauty.mp3');
const panic = new Audio('./sounds/panic.mp3');

document.querySelector('.cards__container_thief').addEventListener('click', (event) => {
  if (event.target.classList.contains('js-beauty') || event.target.closest('.js-beauty')) {
    beauty.play();
  } else if (event.target.classList.contains('js-panic') || event.target.closest('.js-panic')) {
    panic.play();
  }
});


const jail = new Audio('./sounds/jail.mp3');
const dynamite = new Audio('./sounds/dynamite.mp3');

document.querySelector('.cards__container_debuff').addEventListener('click', (event) => {
  if (event.target.classList.contains('js-jail') || event.target.closest('.js-jail')) {
    jail.play();
  } else if (event.target.classList.contains('js-dynamite') || event.target.closest('.js-dynamite')) {
    dynamite.play();
  }
});


const saloon = new Audio('./sounds/saloon.mp3');
const gutling = new Audio('./sounds/gutling.mp3');
const indians = new Audio('./sounds/indians.mp3');
const duel = new Audio('./sounds/duel.mp3');

document.querySelector('.cards__container_event').addEventListener('click', (event) => {
  if (event.target.classList.contains('js-saloon') || event.target.closest('.js-saloon')) {
    saloon.play();
  } else if (event.target.classList.contains('js-gutling') || event.target.closest('.js-gutling')) {
    gutling.play();
  } else if (event.target.classList.contains('js-indians') || event.target.closest('.js-indians')) {
    indians.play();
  } else if (event.target.classList.contains('js-duel') || event.target.closest('.js-duel')) {
    duel.play();
  }
});