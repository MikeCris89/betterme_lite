import habitFactory from "./helpers/habitFactory.js";
import {
  fetchHabits,
  saveHabits,
  clearData,
} from "./helpers/storageHandler.js";
import { renderHabits } from "./UI/habits.js";
import renderTodo from "./UI/todo.js";

const fetchNav = () => {
  fetch("../navbar.html")
    .then((resp) => resp.text())
    .then((data) => {
      document.querySelector("header").innerHTML = data;
    })
    .then(() => {
      const clear = document.querySelector("#clear-data");
      if (clear) clear.addEventListener("click", clearData);
    });
};

fetchNav();

document.addEventListener("DOMContentLoaded", () => {
  const newHabit = document.getElementById("new-habit");
  if (newHabit) newHabit.addEventListener("click", () => formHandler());

  const cancelHabit = document.getElementById("cancel-habit");
  if (cancelHabit) cancelHabit.addEventListener("click", closeModal);

  const closeBtn = document.getElementById("close-modal");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const submit = document.getElementById("habit-form");
  if (submit) submit.addEventListener("submit", handleSubmit);

  if (document.getElementById("todo-list")) renderTodo();

  if (document.getElementById("habit-list")) renderHabits();

  const habitSearch = document.getElementById("habit-search");
  const clearSearch = document.getElementById("clear-search");
  if (clearSearch)
    clearSearch.addEventListener("click", () => {
      habitSearch.value = "";
      renderHabits();
    });

  if (habitSearch) {
    habitSearch.addEventListener("input", () => {
      renderHabits();
    });
  }
});

export const formHandler = (habit) => {
  const form = document.querySelector("#habit-form");

  form.querySelector("h2").innerHTML = habit?.id
    ? "Edit Habit"
    : "Add New Habit";
  form.querySelector("#submit-habit").innerHTML = habit?.id ? "Save" : "Submit";
  form.elements.title.value = habit?.title || "";

  form.elements.perday.value = habit?.perday || "";
  form.elements.perweek.value = habit?.perweek || "";
  form.elements.id.value = habit?.id || "";

  document.getElementById("habit-modal").style.display = "block";
  form.elements.title.focus();
};

export const closeModal = () => {
  document.getElementById("habit-modal").style.display = "none";
};

export const handleSubmit = (e) => {
  e.preventDefault();

  //const { title, perday, perweek, id } = e.target.elements;

  let habits = fetchHabits();

  const habit = e.target.elements;
  const isEdit = !!habit.id.value;

  if (isEdit) {
    //const index = habits.findIndex((el) => el.id === habit.id.value);

    habits = habits.map((el) =>
      el.id === habit.id.value
        ? {
            ...el,
            title: habit.title.value,
            perday: habit.perday.value,
            perweek: habit.perweek.value,
          }
        : el
    );
  } else {
    const newHabit = habitFactory(habit);
    habits.push(newHabit);
  }

  //save new habits array to local storage
  saveHabits(habits);

  if (isEdit) {
    closeModal();
  } else {
    e.target.reset();
    document.querySelector("#habit-form").elements.title.focus();
  }

  //re render the list of good habits
  renderHabits();
};
