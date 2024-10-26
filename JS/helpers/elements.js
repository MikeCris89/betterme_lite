export const addElement = (el = "div", classes = [], text = "") => {
  const newEl = document.createElement(el);
  classes.forEach((cl) => newEl.classList.add(cl));
  newEl.textContent = text;
  return newEl;
};
