import { fetchHabits } from "./storageHandler.js";

const habitFactory = ({ title, perday, perweek }) => {
  return {
    title: title.value,
    frequency: { perday: perday.value, perweek: perweek.value },
    perday: perday.value,
    perweek: perweek.value,
    id: generateId(),
  };
};

const newId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const generateId = () => {
  let id = newId();
  const existing = fetchHabits();
  while (existing.some((el) => el.id === id)) {
    id = newId();
  }
  return id;
};

export default habitFactory;
