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

  basedatas.typeselect === "left"
    ? (amount = Math.round(
        (actualPrice / basedatas.passtype) * basedatas.minutes
      ))
    : (amount = Math.round(
        (actualPrice / basedatas.passtype) *
          (basedatas.passtype - basedatas.minutes)
      ));
  
  // call roundToFive function w/ amount variable
  let roundedPrice = roundToFive(amount);
  
  // show result,
  // maybe it would be nicer if pop ups a modal!
  document.querySelector(
    ".roundedgetback"
  ).innerHTML = `${roundedPrice.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
  })} és ${deposit.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
  })} kaució!`;

  // remove the 'hidden' class from the result div in index.html
  document.querySelector(".hidden").classList.remove("hidden");
};

// Selecting the method which way to calculate the refundable amount of money
const selectCalculateMethod = (event) => {
  timeSelectors.forEach((item) => item.removeAttribute("readonly"));

  basedatas.typeselect = event.target.value;

  const tw = document.querySelector(".timewords");
  tw.innerHTML = "";
  tw.innerHTML = `${event.target.id}`;
};


// add eventListener's to each radio buttons for the 'change' event
radioButtons.forEach((radioButton) =>
  radioButton.addEventListener("change", selectCalculateMethod)
);

// add ebentListener to the Calc button's 'click' event
calcButton.addEventListener("click", calculate);
