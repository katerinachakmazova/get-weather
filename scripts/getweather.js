'use strict'
const radiobuttons = Array.from(document.getElementsByName('choose'));
const radioName = radiobuttons[0];
const radioId = radiobuttons[1];
const inputName = document.getElementById('cityname');
const inputId = document.getElementById('cityid');
const buttonConfirm = document.querySelector('[type="submit"]');
const buttonCancel = document.querySelector('[type="reset"]');
const spans = Array.from(document.getElementsByTagName('span'));
const p = document.getElementById('message');
const requestUrl = `https://api.openweathermap.org/data/2.5/weather?`;
const appId = '0a1fe5dca73a998ba91495c5f67747c1';
let request;
async function createRequest(event){
  event.preventDefault();
  p.textContent = '';
  for(let span of spans){
    span.textContent = '';
  }
  radioName.checked ? request = new Request(`${requestUrl}q=${inputName.value.trim()}&appid=${appId}&units=metric`) : request = new Request(`${requestUrl}id=${inputId.value.trim()}&appid=${appId}&units=metric`);
  try {
    const response = await fetch(request);
    if(!response.ok) throw new Error('Something went wrong with your request.Try again!')
    const json = await response.json();
    spans[0].textContent = await json.main.temp;
    spans[1].textContent = await json.wind.speed;
    spans[2].textContent = await json.main.humidity;
  } catch (error) {
    p.textContent = error.message;
    p.removeAttribute('hidden');
  }
}
function checkRadioButtons(){
  if(radioName.checked){
    inputId.setAttribute('disabled', true)
    inputName.removeAttribute('disabled')
  }
  else{
    inputName.setAttribute('disabled', true)
    inputId.removeAttribute('disabled')
  }
}
checkRadioButtons();
radioName.addEventListener('change', ()=> {  //checking which radio-button's chosen
  inputId.setAttribute('disabled', true)
  inputName.removeAttribute('disabled')
})
radioId.addEventListener('change', ()=> {
  inputName.setAttribute('disabled', true)
  inputId.removeAttribute('disabled')
})

buttonConfirm.addEventListener('click', createRequest)
buttonCancel.addEventListener('click', (event) => {
  for(let span of spans){
    span.textContent = '';
  }
  p.textContent = ''
  p.setAttribute('hidden', true);
  radioName.checked = true;
  checkRadioButtons();
})
