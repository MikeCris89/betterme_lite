import habitFactory from './utils/habitFactory.js';
import { fetchHabits, saveHabits, deleteHabit } from './UI/habits.js';
import { checkDates } from './utils/storageHandler.js';
import { renderHabits } from './UI/habits.js';
import './UI/stats.js';
import { cleanTabs } from './utils/helpers.js';
import { openSettings } from './UI/Settings.js';

const initializeApp = async () => {
	// Fetch Habits
	fetchHabits();

	// Check Dates and Progress Reset
	checkDates();

	// Render UI and Event Listeners
	renderUI();
};

const renderUI = () => {
	document.addEventListener('DOMContentLoaded', () => {
		// Settings Modal
		const settIcon = document.getElementById('sett-icon');
		if (settIcon) {
			settIcon.addEventListener('click', () => {
				openSettings();
			});
		}

		// New Habit Button
		const newHabit = document.getElementById('new-habit');
		if (newHabit)
			newHabit.addEventListener('click', () => {
				formHandler();
				//openModal();
			});

		// Tabs

		const todoTab = document.getElementById('tab-todo');
		const compTab = document.getElementById('tab-complete');
		cleanTabs();
		todoTab.classList.add('active');
		// To-Do
		if (todoTab) {
			todoTab.addEventListener('click', () => {
				cleanTabs();
				todoTab.classList.add('active');
				renderHabits();
			});
		}
		// Complete
		if (compTab) {
			compTab.addEventListener('click', () => {
				cleanTabs();
				compTab.classList.add('active');
				renderHabits();
			});
		}

		// Search Bar
		const habitSearch = document.getElementById('habit-search');
		const clearSearch = document.getElementById('clear-search');
		const searchIcon = document.getElementById('search-tab');
		if (clearSearch)
			if (habitSearch.value === '') clearSearch.style.display = 'none';
		clearSearch.addEventListener('click', () => {
			habitSearch.value = '';
			renderHabits();
			clearSearch.style.display = 'none';
		});
		if (habitSearch) {
			habitSearch.addEventListener('input', () => {
				renderHabits();
				if (habitSearch.value === '') {
					clearSearch.style.display = 'none';
				} else {
					clearSearch.style.display = 'inline';
				}
			});
		}
		if (searchIcon) {
			searchIcon.addEventListener('click', () => {
				cleanTabs();
				openSearch();
				renderHabits();
			});
		}

		// Render Habit List
		if (document.querySelector('.habit-list')) renderHabits();
	});
};

/**Search Bar */
export const openSearch = () => {
	const searchCont = document.querySelector('.search-container');
	searchCont.classList.add('visible');
	document.getElementById('search-tab').classList.add('active');
};

export const formHandler = async (habit = null) => {
	const modal = newModal();

	const modalBody = modal.querySelector('.modal-body');
	const formResp = await fetch('./habitForm.html');
	const formHtml = await formResp.text();

	modalBody.insertAdjacentHTML('beforeend', formHtml);

	const form = modal.querySelector('#habit-form');

	// Header
	modal.querySelector('.modal-header #modal-title').textContent = habit?.id
		? 'Edit Habit'
		: 'Add New Habit';

	// Footer
	const submitBtn = modal.querySelector('.modal-footer #submit-btn');
	submitBtn.style.display = 'inline';
	submitBtn.textContent = habit?.id ? 'Save' : 'Submit';
	form.addEventListener('submit', handleSubmit);

	const cancelBtn = modal.querySelector('.modal-footer #close-modal-btn');
	cancelBtn.addEventListener('click', () => {
		habit?.id
			? (function () {
					viewDetails(habit);
					//openModal();
			  })()
			: closeModal();
	});

	//Body
	form.elements.title.value = habit?.title || '';
	form.elements.perday.value = habit?.freq.day.per || '';
	form.elements.perweek.value = habit?.freq.week.daysPer || '';
	form.elements.id.value = habit?.id || '';
	form.elements.title.focus();

	openModal(modal);
};

export const closeModal = () => {
	const modal = document.getElementById('modal');
	modal.innerHTML = '';
	modal.style.display = 'none';
};

export const newModal = () => {
	const temp = document.getElementById('modal-template');
	const clone = temp.content.cloneNode(true);

	// X Close Button Modal
	const closeBtn = clone.querySelector('#close-modal-x');
	if (closeBtn) closeBtn.addEventListener('click', closeModal);

	return clone;
};

export const openModal = (content) => {
	const modal = document.getElementById('modal');

	modal.innerHTML = '';
	modal.appendChild(content);

	modal.style.display = 'flex';
};

export const clearEventListeners = (el) => {
	const clone = el.cloneNode(true);
	el.parentNode.replaceChild(clone, el);
	return clone;
};

export const viewDetails = async (habit) => {
	const modal = newModal();
	const cancelBtn = modal.querySelector('.modal-footer #close-modal-btn');

	const resp = await fetch('./habitDetails.html');
	const detailsView = await resp.text();

	// Modal Header
	modal.querySelector('.modal-header #modal-title').textContent = 'Details';

	// Modal Body
	const modalBody = modal.querySelector('.modal-body');
	modalBody.insertAdjacentHTML('beforeend', detailsView);
	// Edit button
	modalBody.querySelector('.edit-btn').addEventListener('click', () => {
		formHandler(habit);
	});
	// Delete button
	modalBody.querySelector('.del-btn').addEventListener('click', () => {
		deleteHabit(habit.id);
		closeModal();
	});
	// Body Content
	modalBody.querySelector('#title').textContent = habit.title;
	modalBody.querySelector('#perday').textContent = habit.freq.day.per;
	modalBody.querySelector('#perweek').textContent = habit.freq.week.daysPer;

	modalBody.querySelector('#compToday').textContent = habit.freq.day.complete;
	modalBody.querySelector('#compWeek').textContent = habit.freq.week.complete;
	modalBody.querySelector('#compAll').textContent = habit.freq.allTime.complete;
	// Dates
	const startDate = new Date(habit.createdAt);
	modalBody.querySelector('#startdate').textContent =
		startDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

	// const weekDate = new Date(habit.freq.week.date);
	// modalBody.querySelector('#thisweek').textContent = weekDate.toLocaleDateString(
	// 	'en-US',
	// 	{
	// 		year: 'numeric',
	// 		month: 'long',
	// 		day: 'numeric',
	// 	}
	// );

	// Modal Footer
	cancelBtn.innerHTML = 'Close';
	cancelBtn.addEventListener('click', closeModal);
	modal.querySelector('.modal-footer #submit-btn').style.display = 'none';

	openModal(modal);
};

export const handleSubmit = async (e) => {
	e.preventDefault();

	let habits = await fetchHabits();

	const habitEl = e.target.elements;
	const isEdit = !!habitEl.id.value;

	let newHabit = {
		title: habitEl.title.value,
		perDay: Number(habitEl.perday.value),
		daysPerWeek: Number(habitEl.perweek.value),
	};

	// Edit and update habits
	if (isEdit) {
		const perWeek = newHabit.perDay * newHabit.daysPerWeek;
		habits = habits.map((el) =>
			el.id === habitEl.id.value
				? {
						...el,
						title: newHabit.title,
						freq: {
							...el.freq,
							day: { ...el.freq.day, per: newHabit.perDay },
							week: {
								...el.freq.week,
								per: perWeek,
								daysPer: newHabit.daysPerWeek,
							},
						},
				  }
				: el
		);
	} else {
		// New Habits
		console.log('New Habit: ', newHabit);
		const newHabitObj = await habitFactory(newHabit);
		console.log('Habit Obj: ', newHabitObj);
		habits.push(newHabitObj);
	}

	//save new habits array to local storage
	await saveHabits(habits);

	if (isEdit) {
		viewDetails(habits.find((habit) => habit.id === habitEl.id.value));
	} else {
		closeModal();
	}

	//re render the list of habits
	renderHabits();
};

initializeApp();
