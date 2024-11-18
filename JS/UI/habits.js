import { viewDetails } from '../app.js';
import { addElement, getProgressColor } from '../utils/helpers.js';
import { checkOff, fetchHabits } from '../utils/storageHandler.js';
import renderStats from './stats.js';

//let renderId = 0;
let ignore = false;

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
	perDay.textContent = `${habit.freq.day.complete} / ${habit.freq.day.per}`;

	const progressBar = container.querySelector('.progress-bar');
	const progressValue = Math.min(
		100,
		(habit.freq.week.complete / habit.freq.week.per) * 100
	);
	progressBar.style.background = getProgressColor(progressValue, true);
	progressBar.style.borderColor = 'green';

	//document.documentElement.style.setProperty('--progress', progressValue);

	// checkmark
	const checkmark = container.querySelector('.fa-check');
	checkmark.addEventListener('click', () => {
		checkOff(habit);
	});
	return container;
};

const sortHabits = (habits) => {
	return habits.sort((a, b) => a.freq.day.complete - b.freq.day.complete);
};

const renderHabits = async () => {
	if (ignore) return;
	ignore = true;
	// const thisId = renderId + 1;
	// renderId = thisId;
	const habitList = document.getElementById('habit-list');
	habitList.innerHTML = '';

	let habits = await fetchHabits();
	//if (renderId !== thisId) return;
	console.log('Rendering habits.');
	const list = addElement('div', ['flex', 'col', 'gap1', 'habit-cont']);

	console.log('HABITS RESP: ', habits);
	renderStats();

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
					habit.freq.week.complete < habit.freq.week.per &&
					habit.freq.day.complete < habit.freq.day.per
			);
		} else if (compTab.classList.contains('active')) {
			habits = habits.filter(
				(habit) =>
					habit.freq.day.complete >= habit.freq.day.per ||
					habit.freq.week.complete >= habit.freq.week.per
			);
		}
	}

	// Sort habits by least daily completed
	habits = sortHabits(habits);

	// Create habit card and append to DOM
	habits.forEach((habit) => {
		list.appendChild(cardElement(habit));
	});

	habitList.appendChild(list);
	//renderId = 0;
	ignore = false;
};

export default renderHabits;
