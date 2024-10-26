import { renderHabits } from "../UI/habits.js";

export const fetchHabits = () => {
  return JSON.parse(localStorage.getItem("habits")) || [];
};

export const saveHabits = (habitArr) => {
  localStorage.setItem("habits", JSON.stringify(habitArr));
};

export const clearData = () => {
  console.log("data cleared");
  localStorage.clear();
  renderHabits();
};

export const deleteHabit = (id) => {
  const habits = fetchHabits();
  const newHabits = habits.filter((habit) => habit.id !== id);
  saveHabits(newHabits);
  renderHabits();
};
