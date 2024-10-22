import { fetchHabits } from "../helpers/storageHandler.js";
import { formHandler } from "../app.js";

const habitCard = (habit) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.addEventListener("click", () => {
    formHandler(habit);
  });

  const habitTitle = document.createElement("h3");
  habitTitle.textContent = habit.title;

  const freq = document.createElement("p");
  freq.textContent = `${habit.frequency} per week`;
  card.appendChild(habitTitle);
  card.appendChild(freq);
  return card;
};

export const renderHabits = () => {
  const habitList = document.querySelector("#habit-list");
  habitList.innerHTML = " ";
  const habitContainer = document.createElement("ul");
  const habitArr = fetchHabits();

  habitArr.forEach((habit) => {
    const habitItem = document.createElement("li");
    habitItem.appendChild(habitCard(habit));
    habitContainer.appendChild(habitItem);
  });
  habitList.appendChild(habitContainer);
};
