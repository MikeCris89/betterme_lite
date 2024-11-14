import { viewDetails } from "../app.js";
import { addElement, thisWeekStart, today } from "../utils/helpers.js";
import { checkOff, fetchHabits } from "../utils/storageHandler.js";

const cardElement = (habit) => {
  const container = addElement("div", ["flex", "gap1"]);

  // Card Content
  const card = addElement("div", ["card"]);
  card.addEventListener("click", () => viewDetails(habit));
  const title = addElement("h3", [], habit.title);
  const perDay = addElement(
    "p",
    ["align-right"],
    `${habit.progress.day.complete}/${habit.perday} today`
  );
  const perWeek = addElement(
    "p",
    ["align-right"],
    `${habit.progress.week.complete}/${habit.perweek} this week`
  );
  // Checkmark Habit CheckOff
  const checkmark = addElement("button", ["check-btn"]);
  checkmark.innerHTML = "&#x2714;";
  checkmark.addEventListener("click", () => {
    checkOff(habit);
  });

  card.appendChild(title);
  card.appendChild(perDay);
  card.appendChild(perWeek);
  container.appendChild(card);
  container.appendChild(checkmark);
  return container;
};

const sortHabits = (habits) => {
  return habits.sort(
    (a, b) => a.progress.day.complete - b.progress.day.complete
  );
};

const renderHabits = () => {
  const habitList = document.getElementById("habit-list");
  habitList.innerHTML = "";
  const list = addElement("div", ["flex", "col", "gap1"]);
  let habits = fetchHabits();

  // Active Tabs / Filtering Habits
  const todoTab = document.getElementById("tab-todo");
  const compTab = document.getElementById("tab-complete");
  const searchBar = document.getElementById("habit-search");

  if (todoTab && compTab) {
    if (searchBar && searchBar.value) {
      habits = habits.filter((habit) =>
        habit.title.toLowerCase().includes(searchBar.value.toLowerCase())
      );
    } else if (todoTab.classList.contains("active")) {
      habits = habits.filter(
        (habit) =>
          habit.progress.week.complete < habit.perweek &&
          habit.progress.day.complete < habit.perday
      );
    } else if (compTab.classList.contains("active")) {
      habits = habits.filter(
        (habit) =>
          habit.progress.day.complete >= habit.perday ||
          habit.progress.week.complete >= habit.perweek
      );
    }
  }

  // Sort habits by least daily completed
  habits = sortHabits(habits);

  // Create habit card and append to DOM
  habits.forEach((habit) => {
    const habitItem = addElement();
    habitItem.appendChild(cardElement(habit));
    list.appendChild(habitItem);
  });

  habitList.appendChild(list);
};

export default renderHabits;
