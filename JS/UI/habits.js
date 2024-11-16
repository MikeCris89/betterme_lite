import { viewDetails } from '../app.js';
import {
	addElement,
	getProgressColor,
	thisWeekStart,
	today,
} from '../utils/helpers.js';
import { checkOff, fetchHabits } from '../utils/storageHandler.js';

const cardElement = (habit) => {
	// get template and clone
	const template = document.getElementById('habit-card-template');
	const container = template.content.cloneNode(true);

	// card
	const card = container.querySelector('.card');
	card.addEventListener('click', () => viewDetails(habit));

	//content
	container.querySelector('.habit-title').textContent = habit.title;

	const perDay = container.querySelector('.habit-per-day');
	perDay.textContent = `${habit.progress.day.complete} / ${habit.progress.day.per}`;

	const progressBar = container.querySelector('.progress-bar');
	const progressValue =
		(habit.progress.week.complete /
			(habit.progress.week.per * habit.progress.day.per)) *
		100;
	progressBar.style.background = getProgressColor(progressValue, true);
	progressBar.style.borderColor = 'green';

	// checkmark
	const checkmark = container.querySelector('.fa-check');
	checkmark.addEventListener('click', () => {
		checkOff(habit);
	});
	return container;
};

const sortHabits = (habits) => {
	return habits.sort(
		(a, b) => a.progress.day.complete - b.progress.day.complete
	);
};

const renderHabits = () => {
	const habitList = document.getElementById('habit-list');
	habitList.innerHTML = '';
	const list = addElement('div', ['flex', 'col', 'gap1']);
	let habits = fetchHabits();

	// Active Tabs / Filtering Habits
	const todoTab = document.getElementById('tab-todo');
	const compTab = document.getElementById('tab-complete');
	const searchBar = document.getElementById('habit-search');

	if (todoTab && compTab) {
		if (searchBar && searchBar.value) {
			habits = habits.filter((habit) =>
				habit.title.toLowerCase().includes(searchBar.value.toLowerCase())
			);
		} else if (todoTab.classList.contains('active')) {
			habits = habits.filter(
				(habit) =>
					habit.progress.week.complete < habit.progress.week.per &&
					habit.progress.day.complete < habit.progress.day.per
			);
		} else if (compTab.classList.contains('active')) {
			habits = habits.filter(
				(habit) =>
					habit.progress.day.complete >= habit.progress.day.per ||
					habit.progress.week.complete >= habit.progress.week.per
			);
		}
	}

	// Sort habits by least daily completed
	habits = sortHabits(habits);

	// Create habit card and append to DOM
	habits.forEach((habit) => {
		const habitItem = addElement();
		habitItem.appendChild(cardElement(habit));
		list.appendChild(habitItem);
	});

	habitList.appendChild(list);
};

export default renderHabits;
