'use strict'

const radioName = document.getElementsByName('choose')[0];
const radioId = document.getElementsByName('choose')[1];
const inputName = document.getElementById('cityname');
const inputId = document.getElementById('cityid');
const buttonConfirm = document.querySelector('[type="submit"]');
const spans = document.getElementsByTagName('span');
const firstRequestUrl = `http://api.openweathermap.org/geo/1.0/`;
const secondRequestUrl = `https://api.openweathermap.org/data/2.5/weather?`;
const p = document.getElementById('message');
const appId = '0a1fe5dca73a998ba91495c5f67747c1';
let firstRequest;
let secondRequest;
let chosenOption = 3;
let data;
let coordinates;
radioName.addEventListener('change', ()=> {  //checking which radio-button's chosen
  inputId.setAttribute('disabled', true)
  inputName.removeAttribute('disabled')
  chosenOption = 0;
})
radioId.addEventListener('change', ()=> {
  inputName.setAttribute('disabled', true)
  inputId.removeAttribute('disabled')
  chosenOption = 1;
})
function createRequest(option) {
  let request;
  switch(option){                                         
    case 0: //name
      data = inputName.value.trim();
      request = new Request(`${firstRequestUrl}direct?q=${data}&limit=1&appid=${appId}`)
      break;
    case 1: //id
      data = inputId.value;
      request = new Request(`${firstRequestUrl}zip?zip=${data}&appid=${appId}`)
      break;
    case 2: //lat and lon
      request = new Request(`${secondRequestUrl}lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&appid=${appId}`)
      break;
    case 3: //non of the radio buttons are checked
      request = 'Please select your option of searching the city (ID or Name)';
  }
  return request;
}
buttonConfirm.addEventListener('click', (event) => { 
  event.preventDefault();
  firstRequest = createRequest(chosenOption);
    if(chosenOption !== 3){
      fetch(firstRequest)
      .then((response) => {
        if(!response.ok) throw new Error('Invalid input of the city')
        return response.json()
      })
      .then((obj) => {
        if(Array.isArray(obj)){
          coordinates = [obj[0].lat, obj[0].lon]
        }
        else {
          coordinates = [obj.lat, obj.lon]
        }
        chosenOption = 2;
        return coordinates;
      })
      .then((coords) => {
        secondRequest = createRequest(chosenOption);
        if(chosenOption !== 3){
          fetch(secondRequest)
          .then((res) => {
            if(!res.ok) throw new Error('Invalid input of the city')
            return res.json()
          })
          .then((data) => {
            spans[0].textContent = data.main.temp;
            spans[1].textContent = data.wind.speed;
            spans[2].textContent = data.main.humidity;
          })
        }
      })
      .catch((error) => {
        p.textContent = error.message;
        p.removeAttribute('hidden')
      })
    }
    else {
      p.textContent = firstRequest;
      p.removeAttribute('hidden')
    }
})
