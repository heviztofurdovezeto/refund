"use strict";

const today = new Date();

import {
  seasonTicket
} from "../assets/config.js";

const passTypeSelector = document.querySelector(".typeselect");
const dateSelector = document.querySelector(".date");
const radioButtons = document.querySelectorAll(".radiobtn");
const timeSelectors = document.querySelectorAll(".timeselect");
const calcButton = document.querySelector(".calculate");
const modal = document.getElementById("myModal");

const basedatas = {
  passtype: "",
  querydate: 0,
  minutes: 0,
  typeselect: "",
};

// Generate a date number for querying
const queryDateFunc = (date) => {
  let queryDate;
  date.getMonth() >= 3 ?
    (queryDate = `${date.getFullYear()}0401`) :
    (queryDate = `${date.getFullYear() - 1}0401`);
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

  lastDigit > 0 && lastDigit <= 2.49 ?
    (price = price - lastDigit) :
    lastDigit > 2.5 && lastDigit <= 4.99 ?
    (price = price + (5 - lastDigit)) :
    lastDigit > 5 && lastDigit <= 7.49 ?
    (price = price + (5 - lastDigit)) :
    lastDigit > 7.5 && lastDigit <= 9.99 ?
    (price = price + (5 - (lastDigit - 5))) :
    (price = price);

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
    ?
    (amount = Math.round(
      (actualPrice / basedatas.passtype) * basedatas.minutes
    )) :
    (amount = Math.round(
      (actualPrice / basedatas.passtype) *
      (basedatas.passtype - basedatas.minutes)
    ));
  
  // call roundToFive function w/ amount variable
  let roundedPrice = roundToFive(amount);

  const modalData = {
    title: ``,
    getback: ``,
    deposit: ``,
  };

  modalData.title = `Visszatérítendő összeg`;
  modalData.getback = `${roundedPrice.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
  })}-ot`;
  modalData.deposit = `Visszatérítendő továbbá ${deposit.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
  })} kaució!`;

  // Add content to the modal befor showing it
  document.querySelector(".modal-title").innerHTML = modalData.title;
  document.querySelector(".getback__pay--amount").innerHTML = modalData.getback;
  document.querySelector(".getback__deposit").innerHTML = modalData.deposit;

  showModal();
};

const showModal = () => {
  modal.addEventListener("shown.bs.modal", function (event) { });
};

const selectCalculateMethod = (event) => {
  timeSelectors.forEach((item) => item.removeAttribute("readonly"));

  basedatas.typeselect = event.target.value;

  const tw = document.querySelector(".timewords");
  tw.innerHTML = "";
  tw.innerHTML = `${event.target.id}`;
};

// Adding eventListenrs to the radio buttons
radioButtons.forEach((radioButton) =>
  radioButton.addEventListener("change", selectCalculateMethod)
);

// Init calculating by clicking the "Számol" button
calcButton.addEventListener("click", calculate);

// Relode the page by closing the Modal
document
  .getElementById("myModal")
  .addEventListener("hide.bs.modal", function (event) {
    location.reload(true);
  });
