"use strict";

const today = new Date();

import { seasonTicket } from "../assets/config.js";

const passTypeSelector = document.querySelector(".typeselect");
const dateSelector = document.querySelector(".date");
const radioButtons = document.querySelectorAll(".radiobtn");
const timeSelectors = document.querySelectorAll(".timeselect");
const calcButton = document.querySelector(".calculate");

const basedatas = {
  passtype: "",
  querydate: 0,
  minutes: 0,
  typeselect: "",
};

// Generate a date number for querying
const queryDateFunc = (date) => {
  let queryDate;
  date.getMonth() >= 3
    ? (queryDate = `${date.getFullYear()}0401`)
    : (queryDate = `${date.getFullYear() - 1}0401`);
  basedatas.querydate = queryDate;

  return;
};

// Querying the the proper object for the query date
const getActualYearObject = (date) => {
  let obj;
  obj = seasonTicket[date];
  return obj;
};

// Math.round() példa kód
/* 
const testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.1, 12.2, 13.3, 14.4, 15.5, 16.6, 17.7, 18.8, 19.9, 21.11, 22.12, 23.13, 24.14, 25.15, 26.16, 27.17, 28.18, 29.19, 41.41, 42.42, 43.43, 44.44, 45.45, 46.46, 47.47, 48.48, 49.49, 50.499, 50.50, 50.501];
const rounder = (item) => {
  console.log(`szám: ${item}`, `kerekített: ${Math.round(item)}`)
};
testArr.forEach((item) => rounder(item));
*/

// Round to 5 in line with the hungarian national round to five regulations
// If U have more time to code, transcribe it to Math.round (.floor or .ceil) type of rounding
const roundToFive = (price) => {
  let interPrice = price.toString();
  let lastDigit = parseInt(interPrice[interPrice.length - 1]);

  lastDigit > 0 && lastDigit <= 2.49
    ? (price = price - lastDigit)
    : lastDigit > 2.5 && lastDigit <= 4.99
    ? (price = price + (5 - lastDigit))
    : lastDigit > 5 && lastDigit <= 7.49
    ? (price = price + (5 - lastDigit))
    : lastDigit > 7.5 && lastDigit <= 9.99
    ? (price = price + (5 - (lastDigit - 5)))
    : (price = price);

  return price;
};

// Collecting the datas & calculate the amount of refundable price
const calculate = () => {
  // collecting basedatas
  let hours = parseInt(document.querySelector(".hours").value || 0);
  let mins = parseInt(document.querySelector(".minutes").value || 0);
  basedatas.minutes = hours * 60 + mins;
  basedatas.passtype = passTypeSelector.value;
  queryDateFunc(
    new Date(
      new Date(dateSelector.value).getFullYear(),
      new Date(dateSelector.value).getMonth(),
      new Date(dateSelector.value).getDate()
    )
  );

  let actualPrice = getActualYearObject(basedatas.querydate)[basedatas.passtype]
    .price;
  let deposit = getActualYearObject(basedatas.querydate).deposit;
  let amount;

  basedatas.typeselect === "left" // Azért ideje megtanulnod, hogy `===` használj ha feltételt vizsgálsz, de minimum `==` kell
    ? (amount = Math.round(
        (actualPrice / basedatas.passtype) * basedatas.minutes
      )) // maybe OK, but controll
    : (amount = Math.round(
        (actualPrice / basedatas.passtype) *
          (basedatas.passtype - basedatas.minutes)
      )); // maybe OK, but controll
  // VIGYÁZZ, a parseInt csak levágja a tizedeseket,
  // Math.round() -t kell használnod!!!

  // console.log('Visszatérítendő: ', amount);

  // call roundToFive function w/ amount variable
  let roundedPrice = roundToFive(amount); // Ezt a sort vedd majd ki kommentből
  // console.log('Kerekített:', roundedPrice);

  // show result, maybe pop ups a modal!
  document.querySelector(
    ".roundedgetback"
  ).innerHTML = `${roundedPrice.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
  })} és ${deposit.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
  })} kaució!`;

  document.querySelector(".hidden").classList.remove("hidden");
};

const selectCalculateMethod = (event) => {
  timeSelectors.forEach((item) => item.removeAttribute("readonly"));

  basedatas.typeselect = event.target.value;

  const tw = document.querySelector(".timewords");
  tw.innerHTML = "";
  tw.innerHTML = `${event.target.id}`;
};

// Refund check modal
/* modal-div 


*/

// Ez a működő funkcióhívás a radio gombokhoz
radioButtons.forEach((radioButton) =>
  radioButton.addEventListener("change", selectCalculateMethod)
);

calcButton.addEventListener("click", calculate);

/*   

// Az 'change' eseménynél figyelt (input) elemek kiválasztása
const querySelections = document.querySelectorAll(".odselect");

// 'change' esemény hozzárendelése minden kívánt input elemhez
querySelections.forEach((input) => {
  input.addEventListener(
    "change",
    // callback funkció átadása, hogy mi történjen a change esemény bekövetkeztekor
    handleDateChange
    );
});

function handleDateChange(event) {
  const year = document.getElementById("yearSelect").value;
  const month = document.getElementById("monthSelect").value;
  viewMonth = new Date(year, month, 1);
  addFullMonth(viewMonth);
}

*/

// Get a date VariableName (basics)
/* let todayVariableName;
today.getMonth() <= 9 ?
  (todayVariableName = `${today.getFullYear()}0${
      today.getMonth() + 1
    }${today.getDate()}`) :
  (todayVariableName = `${today.getFullYear()}${
      today.getMonth() + 1
    }${today.getDate()}`);
console.log(todayVariableName); */

/* Hogyan keresd ki, melyik év bérletárait használd?!

HA a vásárlás hónapja (és napja) nagyobb-egyenlő április 1 ?
AKKOR a keresés éve szerinti objektum :
KÜLÖNBEN a keresés éve előtt évhez kapcsolódó objektum
selectDate.getMonth() >= 3
? selectDate.getMonth() <9 ? queryDate = `${selectDate.getFullYear()}0${selectDate.getMonth() + 1}01` : queryDate = `${selectDate.getFullYear()}${selectDate.getMonth() + 1}01`
: selectDate.getMonth() <9 ? queryDate = `${selectDate.getFullYear() - 1}0${selectDate.getMonth() + 1}01` : queryDate = `${selectDate.getFullYear() - 1}${selectDate.getMonth() + 1}01`;
*/

// Mivel április 1-jén vált mindig, így elég ilyen röviden megírni:
/* selectDate.getMonth() >= 3 ?
  (queryDate = `${selectDate.getFullYear()}0401`) :
  (queryDate = `${selectDate.getFullYear() - 1}0401`);
console.log(queryDate); */

/* Visszatérítendő összeg kiszámítása kidolgozott alap logika

document.getElementById('calculate-btn').addEventListener('click', calculateRefund);

function calculateRefund() {
  // Bérlettípusok definíciója
  const passes = [
    { minutes: 600, price: 13000, validityDays: 11 },
    { minutes: 660, price: 13000, validityDays: 11 },
    { minutes: 1200, price: 23000, validityDays: 15 },
    { minutes: 1320, price: 23000, validityDays: 15 }
  ];

  // Konstansok
  const deposit = 2000;

  // Felhasználótól adatok bekérése
  const purchaseDate = new Date(document.getElementById('purchase-date').value);
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const passType = parseInt(document.getElementById('pass-type').value);

  // Visszatérítési lehetőség ellenőrzése
  const pass = passes[passType];
  const validUntil = new Date(purchaseDate.getTime() + pass.validityDays * 24 * 60 * 60 * 1000);
  const currentDate = new Date();
  const withinValidity = currentDate <= validUntil;

  if (withinValidity) {
    // Visszatérítés kiszámítása
    const baseMinutes = pass.minutes;
    const usedMinutes = hours * 60 + minutes;    
    const refundableMinutes = baseMinutes - usedMinutes;    
    const refundableAmount = parseFloat(pass.price / baseMinutes * refundableMinutes);
    console.log(pass.price, baseMinutes, refundableMinutes, refundableAmount);

    document.getElementById('result').textContent = `Visszatérítendő összeg: ${refundableAmount} Ft`;
  } else {
    document.getElementById('result').textContent = "A bérlet már nem érvényes, nincs lehetőség visszatérítésre.";
  }
}


*/
