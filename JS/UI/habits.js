import { fetchHabits } from "../helpers/storageHandler.js";

const habitCard = (title, frequency) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.onclick = () => {};

  const habitTitle = document.createElement("h3");
  habitTitle.textContent = title;

  const freq = document.createElement("p");
  freq.textContent = `${frequency} per week`;
  card.appendChild(habitTitle);
  card.appendChild(freq);
  return card;
};

export const renderHabits = () => {
  const habitList = document.querySelector("#habit-list");
  habitList.innerHTML = " ";
  const habitContainer = document.createElement("ul");
  const habitArr = fetchHabits();

  if (habitArr.length > 0) {
    habitArr.forEach((item) => {
      const habitItem = document.createElement("li");
      habitItem.appendChild(habitCard(item.title, item.frequency));
      habitContainer.appendChild(habitItem);
    });
    habitList.appendChild(habitContainer);
  }
};
