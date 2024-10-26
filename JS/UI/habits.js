import { deleteHabit, fetchHabits } from "../helpers/storageHandler.js";
import { formHandler } from "../app.js";
import { addElement } from "../helpers/elements.js";

let activeCard = null;

const hideBtn = () => {
  if (activeCard) {
    const container = activeCard.parentElement;
    container
      .querySelectorAll(".card-btn")
      .forEach((btn) => (btn.style.display = "none"));
    activeCard.classList.remove("card-selected");
  }
};

const handleDocumentClick = (e) => {
  const modal = document.getElementById("habit-modal");
  if (!modal.contains(e.target)) {
    hideBtn();
    activeCard = null;
    document.removeEventListener("click", handleDocumentClick);
  }
};

const habitCard = (habit) => {
  const container = addElement("div", ["flex", "cntr"]);
  const editBtn = addElement("button", ["btn", "card-btn"], "edit");
  editBtn.style.display = "none";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    formHandler(habit);
  });

  const delBtn = addElement("button", ["btn", "card-btn"], "delete");
  delBtn.style.backgroundColor = "red";
  delBtn.style.color = "white";
  delBtn.style.display = "none";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteHabit(habit?.id);
  });

  const card = addElement();
  card.addEventListener("click", (e) => {
    e.stopPropagation();

    hideBtn();

    if (activeCard !== card) {
      document.addEventListener("click", handleDocumentClick);
      card.classList.add("card-selected");
      activeCard = card;

      editBtn.style.display = "block";
      delBtn.style.display = "block";
    } else {
      card.classList.remove("card-selected");
      document.removeEventListener("click", handleDocumentClick);
      activeCard = null;
      editBtn.style.display = "none";
      delBtn.style.display = "none";
    }
  });
  const habitTitle = addElement("h3", [], habit.title);
  const perDay = addElement("p", [], `${habit.perday} times/day`);
  const perWeek = addElement("p", [], `${habit.perweek} days/week`);

  container.appendChild(card);
  container.appendChild(editBtn);
  container.appendChild(delBtn);
  card.appendChild(habitTitle);
  card.appendChild(perDay);
  card.appendChild(perWeek);

  return container;
};

export const renderHabits = () => {
  const habitSearch = document.getElementById("habit-search");

  const habitList = document.getElementById("habit-list");
  habitList.innerHTML = "";
  const habitContainer = document.createElement("ul");
  let habitArr = fetchHabits();
  if (habitSearch.value) {
    habitArr = habitArr.filter((habit) =>
      habit.title.includes(habitSearch.value)
    );
  }

  habitArr.forEach((habit) => {
    const habitItem = addElement("li");
    habitItem.appendChild(habitCard(habit));
    habitContainer.appendChild(habitItem);
  });
  habitList.appendChild(habitContainer);
};
