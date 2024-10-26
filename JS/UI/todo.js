import { addElement } from "../helpers/elements.js";
import { fetchHabits } from "../helpers/storageHandler.js";

const cardElement = (habit) => {
  const card = addElement("div", ["card"]);
  const content = addElement("h3", ["habit-title"], habit.title);
  card.appendChild(content);
  return card;
};

const renderTodo = () => {
  const todoList = document.getElementById("todo-list");
  const list = addElement("ul");
  const habits = fetchHabits();

  habits.forEach((habit) => {
    const habitItem = addElement("li");
    habitItem.appendChild(cardElement(habit));
    list.appendChild(habitItem);
  });

  todoList.appendChild(list);
};

export default renderTodo;
