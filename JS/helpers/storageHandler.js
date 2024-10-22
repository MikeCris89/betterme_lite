export const fetchHabits = () => {
  return JSON.parse(localStorage.getItem("habits")) || [];
};

export const saveHabits = (habitArr) => {
  localStorage.setItem("habits", JSON.stringify(habitArr));
};
