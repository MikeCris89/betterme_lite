import habitFactory from "./utils/habitFactory.js";
import {
  fetchHabits,
  saveHabits,
  clearData,
  deleteHabit,
  checkDates,
} from "./utils/storageHandler.js";
import renderHabits from "./UI/habits.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check Dates and Progress Reset
  checkDates();

  // Test Date
  const testDate = document.getElementById("test-date");
  if (testDate)
    testDate.addEventListener("input", () => {
      checkDates();
      renderHabits();
    });

  // New Habit Button
  const newHabit = document.getElementById("new-habit");
  if (newHabit) newHabit.addEventListener("click", () => formHandler());

  // Cancel Close Buttons for Modals
  const cancelFormHabit = document.getElementById("cancel-habit");
  if (cancelFormHabit) cancelFormHabit.addEventListener("click", closeModal);

  const closeBtn = document.getElementById("close-modal-x");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // Sesarch Bar
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

  // Tabs
  const todoTab = document.getElementById("tab-todo");
  const compTab = document.getElementById("tab-complete");
  todoTab.classList.add("active");
  if (todoTab) {
    todoTab.addEventListener("click", () => {
      todoTab.classList.add("active");
      compTab.classList.remove("active");
      renderHabits();
    });
  }

  if (compTab) {
    compTab.addEventListener("click", () => {
      compTab.classList.add("active");
      todoTab.classList.remove("active");
      renderHabits();
    });
  }

  // Render Habit List
  if (document.getElementById("habit-list")) renderHabits();

  // Clear all data
  const clear = document.getElementById("clear-data");
  if (clear) clear.addEventListener("click", clearData);
});

export const formHandler = async (habit) => {
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = "";

  const formResp = await fetch("/betterme_lite/habitForm.html");
  const formHtml = await formResp.text();

  modalBody.insertAdjacentHTML("beforeend", formHtml);

  const modal = document.getElementById("habit-modal");
  const form = document.getElementById("habit-form");
  modal.style.display = "block";

  // Header
  modal.querySelector("#modal-header h2").textContent = habit?.id
    ? "Edit Habit"
    : "Add New Habit";

  // Footer
  const submitBtn = modal.querySelector("#modal-footer #submit-btn");
  submitBtn.style.display = "inline";
  submitBtn.textContent = habit?.id ? "Save" : "Submit";
  form.addEventListener("submit", handleSubmit);

  const cancelBtn = modal.querySelector("#modal-footer #close-modal-btn");
  cancelBtn.addEventListener("click", () => {
    habit?.id ? viewDetails(habit) : closeModal();
  });

  //Body
  form.elements.title.value = habit?.title || "";
  form.elements.perday.value = habit?.perday || "";
  form.elements.perweek.value = habit?.perweek || "";
  form.elements.id.value = habit?.id || "";
  form.elements.title.focus();
};

export const closeModal = () => {
  document.getElementById("habit-modal").style.display = "none";
  const cancelBtn = document.getElementById("cancel-modal-btn");
  if (cancelBtn) cancelBtn.removeEventListener("click", closeModal);
};

export const viewDetails = async (habit) => {
  const modal = document.getElementById("habit-modal");
  modal.style.display = "block";
  const resp = await fetch("./habitDetails.html");
  const detailsView = await resp.text();
  const cancelBtn = modal.querySelector("#modal-footer #close-modal-btn");

  // Modal Header
  modal.querySelector("#modal-header #modal-title").textContent = "Details";

  // Modal Body
  const modalBody = modal.querySelector("#modal-body");
  modalBody.innerHTML = "";
  modalBody.insertAdjacentHTML("beforeend", detailsView);
  // Edit button
  modalBody.querySelector("#edit-btn").addEventListener("click", () => {
    cancelBtn.removeEventListener("click", closeModal);
    formHandler(habit);
  });
  // Delete button
  modalBody.querySelector("#del-btn").addEventListener("click", () => {
    deleteHabit(habit.id);
    closeModal();
  });
  // Body Content
  modalBody.querySelector("#title").textContent = habit.title;
  modalBody.querySelector("#perday").textContent = habit.perday;
  modalBody.querySelector("#perweek").textContent = habit.perweek;
  // Dates
  const startDate = new Date(habit.createdAt);
  modalBody.querySelector("#startdate").textContent =
    startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const weekDate = new Date(habit.progress.week.date);
  modalBody.querySelector("#thisweek").textContent =
    weekDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Modal Footer

  cancelBtn.innerHTML = "cancel";
  cancelBtn.addEventListener("click", closeModal);
  modal.querySelector("#modal-footer #submit-btn").style.display = "none";
};

export const handleSubmit = (e) => {
  e.preventDefault();

  let habits = fetchHabits();

  const habitEl = e.target.elements;
  const isEdit = !!habitEl.id.value;

  let habit = {
    title: habitEl.title.value,
    perday: habitEl.perday.value,
    perweek: habitEl.perweek.value,
  };

  if (isEdit) {
    habits = habits.map((el) =>
      el.id === habitEl.id.value
        ? {
            ...el,
            ...habit,
          }
        : el
    );
  } else {
    habit = habitFactory(habitEl);
    habits.push(habit);
  }

  //save new habits array to local storage
  saveHabits(habits);

  if (isEdit) {
    viewDetails(habit);
  } else {
    e.target.reset();
    document.querySelector("#habit-form").elements.title.focus();
  }

  //re render the list of good habits
  renderHabits();
};
