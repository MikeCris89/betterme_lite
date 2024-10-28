export const addElement = (el = "div", classes = [], text = "") => {
  const newEl = document.createElement(el);
  classes.forEach((cl) => newEl.classList.add(cl));
  newEl.textContent = text;
  return newEl;
};

export const thisWeekStart = () => {
  const thisWeek = new Date();
  const dayOfWeek = thisWeek.getDay();
  thisWeek.setDate(thisWeek.getDate() - dayOfWeek);
  thisWeek.setHours(0, 0, 0, 0);
  return thisWeek;
};

export const today = () => {
  return new Date(new Date().setHours(0, 0, 0, 0));
};
