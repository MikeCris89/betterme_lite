import habitFactory from "./helpers/habitFactory.js";
import { fetchHabits, saveHabits } from "./helpers/storageHandler.js";
import { renderHabits } from "./UI/habits.js";

document.addEventListener("DOMContentLoaded", () => {
  const newHabit = document.querySelector("#new-habit");
  if (newHabit) newHabit.addEventListener("click", () => formHandler());

  const cancelHabit = document.querySelector("#cancel-habit");
  if (cancelHabit) cancelHabit.addEventListener("click", closeModal);

  const clear = document.querySelector("#clear-data");
  if (clear) clear.addEventListener("click", clearData);

  const submit = document.querySelector("#habit-form");
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

export const formHandler = (habit) => {
  const form = document.querySelector("#habit-form");

  form.querySelector("h2").innerHTML = habit?.id
    ? "Edit Habit"
    : "Add New Habit";
  form.querySelector("#submit-habit").innerHTML = habit?.id ? "Save" : "Submit";
  form.elements.title.value = habit?.title || "";
  form.elements.frequency.value = habit?.frequency || "";
  form.elements.id.value = habit?.id || "";

  document.getElementById("habit-modal").style.display = "block";
};

export const closeModal = () => {
  document.getElementById("habit-modal").style.display = "none";
};

export const handleSubmit = (e) => {
  e.preventDefault();

  const { title, frequency, id } = e.target.elements;

  let habits = fetchHabits();

  const isEdit = !!id.value;

  if (isEdit) {
    const index = habits.findIndex((habit) => habit.id === id.value);
    habits[index].title = title.value;
    habits[index].frequency = frequency.value;
  } else {
    const newHabit = habitFactory(title.value, frequency.value);
    habits.push(newHabit);
  }

  //save new habits array to local storage
  saveHabits(habits);

  if (isEdit) {
    closeModal();
  } else {
    e.target.reset();
  }

  //re render the list of good habits
  renderHabits();
};

const clearData = () => {
  localStorage.clear();
  renderHabits();
};
