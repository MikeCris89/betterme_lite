import { fetchHabits } from "./storageHandler.js";

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

const habitFactory = (title, frequency) => {
  return {
    _title: title,
    _frequency: frequency,
    get title() {
      return this._title;
    },
    set title(newTitle) {
      this._title = newTitle;
    },
    get frequency() {
      return this._frequency;
    },
    set frequency(newFreq) {
      this._frequency = newFreq;
    },
    id: generateId(),
  };
};

export default habitFactory;
