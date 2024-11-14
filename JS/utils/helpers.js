export const addElement = (el = "div", classes = [], text = "") => {
  const newEl = document.createElement(el);
  classes.forEach((cl) => newEl.classList.add(cl));
  newEl.textContent = text;
  return newEl;
};

export const thisWeekStart = () => {
  const dateInput = document.getElementById("test-date").value;
  let thisWeek = dateInput ? new Date(dateInput) : new Date();

  const dayOfWeek = thisWeek.getDay();
  thisWeek.setDate(thisWeek.getDate() - dayOfWeek);
  thisWeek.setHours(0, 0, 0, 0);
  return thisWeek.toISOString();
};

export const today = () => {
  const dateInput = document.getElementById("test-date").value;
  let todayDate = dateInput ? new Date(dateInput) : new Date();
  todayDate.setHours(0, 0, 0, 0);

  return todayDate.toISOString();
};
