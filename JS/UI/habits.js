import { viewDetails } from '../app.js';
import { addElement, getProgressColor } from '../utils/helpers.js';
import { checkOff, fetchHabits } from '../utils/storageHandler.js';
import renderStats from './stats.js';

let ignore = false;

const sortHabits = (habits) => {
	return habits.sort((a, b) => a.freq.day.complete - b.freq.day.complete);
};

const cardElement = (habit) => {
	// get template and clone
	const template = document.getElementById('habit-card-template');
	const container = template.content.cloneNode(true);
	container.querySelector('.card-container').id = `${habit.id}`;
	let dayComplete = habit.freq.day.complete;
	let weekComplete = habit.freq.week.complete;

	// card
	const card = container.querySelector('.card');
	card.addEventListener('click', () => {
		viewDetails(habit);
	});

	//content
	container.querySelector('.habit-title').textContent = habit.title.slice(0, 30);

	const perDay = container.querySelector('.habit-per-day');
	perDay.textContent = `${dayComplete} / ${habit.freq.day.per}`;

	const progressBar = container.querySelector('.progress-bar');
	const progressValue = Math.min(
		100,
		(weekComplete / habit.freq.week.per) * 100
	);
	progressBar.style.background = getProgressColor(progressValue, true);
	progressBar.style.borderColor = 'green';

	//document.documentElement.style.setProperty('--progress', progressValue);

	// checkmark
	const checkmark = container.querySelector('.check-button');
	// const checkmark = container.querySelector('.icon-button');

	setTimeout(() => {
		checkmark.addEventListener('click', () => {
			checkmark.disabled = 'true';
			checkOff(habit);
		});
	}, 300);

	return container;
};

/** Render Habits */

export const renderHabits = async () => {
	if (ignore) return;
	ignore = true;

	const habitList = document.querySelector('.habit-list');
	habitList.innerHTML = '';

	let habits = await fetchHabits();

	console.log('Rendering habits.');
	const list = addElement('div', ['flex', 'col', 'gap2', 'habit-cont']);

	console.log('HABITS RESP: ', habits);
	renderStats();

	// Active Tabs / Filtering Habits
	const todoTab = document.getElementById('tab-todo');
	const compTab = document.getElementById('tab-complete');
	const searchTab = document.getElementById('search-tab');
	const searchBar = document.getElementById('habit-search');

	if (todoTab && compTab) {
		if (searchBar && searchBar.value) {
			habits = habits.filter((habit) =>
				habit.title.toLowerCase().includes(searchBar.value.toLowerCase())
			);
		} else if (
			searchBar &&
			searchBar.value === '' &&
			searchTab.classList.contains('active')
		) {
			habits = [];
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
	setTimeout(() => {
		list.classList.add('visible');
	}, 50);

	ignore = false;
};

/**Search Bar */
export const openSearch = () => {
	const searchCont = document.querySelector('.search-container');
	searchCont.classList.add('visible');
	document.getElementById('search-tab').classList.add('active');
};
