import renderHabits from "../UI/habits.js";

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

export const checkOff = (habit) => {
  const habits = fetchHabits();
  const newHabits = habits.map((el) =>
    el.id === habit.id
      ? {
          ...el,
          progress: {
            ...el.progress,
            day: { ...el.progress.day, complete: el.progress.day.complete + 1 },
            week: {
              ...el.progress.week,
              complete: el.progress.week.complete + 1,
            },
            total: el.progress.total + 1,
          },
        }
      : el
  );
  saveHabits(newHabits);
  renderHabits();
};
