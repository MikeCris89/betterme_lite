import habitFactory from "./helpers/habitFactory.js";
import { fetchHabits, saveHabits } from "./helpers/storageHandler.js";
import { renderHabits } from "./UI/habits.js";

document.addEventListener("DOMContentLoaded", () => {
  const newHabit = document.querySelector("#new-habit");
  if (newHabit) newHabit.addEventListener("click", openModal);

  const cancelHabit = document.querySelector("#cancel-habit");
  if (cancelHabit) cancelHabit.addEventListener("click", closeModal);

  const clear = document.querySelector("#clear-data");
  if (clear) clear.addEventListener("click", clearData);

  const submit = document.querySelector("form");
  if (submit) submit.addEventListener("submit", handleSubmit);

  if (document.querySelector("#habit-list")) renderHabits();
});

const fetchNav = () => {
  fetch("../navbar.html")
    .then((resp) => resp.text())
    .then((data) => {
      document.querySelector("header").innerHTML = data;
    });
};

fetchNav();

const openModal = () => {
  document.getElementById("habit-modal").style.display = "block";
};

const closeModal = () => {
  document.getElementById("habit-modal").style.display = "none";
};

const handleSubmit = (e) => {
  e.preventDefault();
  const { title, frequency } = e.target.elements;

  const newHabit = habitFactory(title.value, frequency.value);

  let habits = fetchHabits();
  habits.push(newHabit);

  //save new habits array to local storage
  saveHabits(habits);

  e.target.reset();

  //re render the list of good habits
  renderHabits();
};

const clearData = () => {
  localStorage.clear();
  renderHabits();
};
