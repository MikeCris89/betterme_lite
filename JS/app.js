import habitFactory from './utils/habitFactory.js';
import {
	fetchHabits,
	saveHabits,
	clearData,
	deleteHabit,
	checkDates,
} from './utils/storageHandler.js';
import renderHabits from './UI/habits.js';
import './UI/stats.js';

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
		// Test Date
		const testDate = document.getElementById('test-date');
		if (testDate)
			testDate.addEventListener('input', () => {
				checkDates();
				renderHabits();
			});

		// Settings Modal
		const settIcon = document.getElementById('sett-icon');
		const sett = document.getElementById('settings');
		if (sett && settIcon) {
			settIcon.addEventListener('click', (e) => {
				e.stopPropagation();
				if (
					getComputedStyle(sett).display === 'none' ||
					sett.style.display === 'none'
				) {
					showSettings();
				} else {
					hideSettings();
				}
			});
		}
		const closeSett = document.getElementById('close-sett-modal');
		if (closeSett) closeSett.addEventListener('click', hideSettings);

		// New Habit Button
		const newHabit = document.getElementById('new-habit');
		if (newHabit) newHabit.addEventListener('click', () => formHandler());

		// Cancel Close Buttons for Modals
		const cancelFormHabit = document.getElementById('cancel-habit');
		if (cancelFormHabit) cancelFormHabit.addEventListener('click', closeModal);

		const closeBtn = document.getElementById('close-modal-x');
		if (closeBtn) closeBtn.addEventListener('click', closeModal);

		// Sesarch Bar
		const habitSearch = document.getElementById('habit-search');
		const clearSearch = document.getElementById('clear-search');
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

			// Theme
			const themeBtn = document.getElementById('theme-btn');
			if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

			const theme = localStorage.getItem('theme') || 'light';
			document.documentElement.setAttribute('data-theme', theme);
		}

		// Tabs
		const todoTab = document.getElementById('tab-todo');
		const compTab = document.getElementById('tab-complete');
		todoTab.classList.add('active');
		if (todoTab) {
			todoTab.addEventListener('click', () => {
				todoTab.classList.add('active');
				compTab.classList.remove('active');
				renderHabits();
			});
		}

		if (compTab) {
			compTab.addEventListener('click', () => {
				compTab.classList.add('active');
				todoTab.classList.remove('active');
				renderHabits();
			});
		}

		// Render Habit List
		if (document.getElementById('habit-list')) renderHabits();

		// Clear all data
		const clear = document.getElementById('clear-data');
		if (clear) clear.addEventListener('click', clearData);
	});
};

const toggleTheme = () => {
	const currTheme = document.documentElement.getAttribute('data-theme');
	const newTheme = currTheme === 'dark' ? 'light' : 'dark';
	document.documentElement.setAttribute('data-theme', newTheme);
	localStorage.setItem('theme', newTheme);
};

const settClickOutside = (e) => {
	const sett = document.getElementById('settings');
	if (!sett.contains(e.target)) {
		hideSettings();
	}
};

const showSettings = () => {
	const settIcon = document.getElementById('sett-icon');
	const sett = document.getElementById('settings');
	settIcon.classList.add('fa-spin');
	setTimeout(() => settIcon.classList.remove('fa-spin'), 1000);
	sett.style.display = 'block';
	document.addEventListener('click', settClickOutside);
};

const hideSettings = () => {
	const settIcon = document.getElementById('sett-icon');
	const sett = document.getElementById('settings');
	settIcon.classList.remove('fa-spin');
	sett.style.display = 'none';
	document.removeEventListener('click', settClickOutside);
};

export const formHandler = async (habit) => {
	const modalBody = document.getElementById('modal-body');
	modalBody.innerHTML = '';

	const formResp = await fetch('./habitForm.html');
	const formHtml = await formResp.text();

	modalBody.insertAdjacentHTML('beforeend', formHtml);

	const modal = document.getElementById('habit-modal');
	const form = document.getElementById('habit-form');
	modal.style.display = 'block';

	// Header
	modal.querySelector('#modal-header #modal-title').textContent = habit?.id
		? 'Edit Habit'
		: 'Add New Habit';

	// Footer
	const submitBtn = modal.querySelector('#modal-footer #submit-btn');
	submitBtn.style.display = 'inline';
	submitBtn.textContent = habit?.id ? 'Save' : 'Submit';
	form.addEventListener('submit', handleSubmit);

	const cancelBtn = modal.querySelector('#modal-footer #close-modal-btn');
	cancelBtn.addEventListener('click', () => {
		habit?.id ? viewDetails(habit) : closeModal();
	});

	//Body
	form.elements.title.value = habit?.title || '';
	form.elements.perday.value = habit?.freq.day.per || '';
	form.elements.perweek.value = habit?.freq.week.daysPer || '';
	form.elements.id.value = habit?.id || '';
	form.elements.title.focus();
};

export const closeModal = () => {
	document.getElementById('habit-modal').style.display = 'none';
	const cancelBtn = document.getElementById('cancel-modal-btn');
	if (cancelBtn) cancelBtn.removeEventListener('click', closeModal);
};

export const viewDetails = async (habit) => {
	const modal = document.getElementById('habit-modal');
	modal.style.display = 'block';
	const resp = await fetch('./habitDetails.html');
	const detailsView = await resp.text();
	const cancelBtn = modal.querySelector('#modal-footer #close-modal-btn');

	// Modal Header
	modal.querySelector('#modal-header #modal-title').textContent = 'Details';

	// Modal Body
	const modalBody = modal.querySelector('#modal-body');
	modalBody.innerHTML = '';
	modalBody.insertAdjacentHTML('beforeend', detailsView);
	// Edit button
	modalBody.querySelector('#edit-btn').addEventListener('click', () => {
		cancelBtn.removeEventListener('click', closeModal);
		formHandler(habit);
	});
	// Delete button
	modalBody.querySelector('#del-btn').addEventListener('click', () => {
		deleteHabit(habit.id);
		closeModal();
	});
	// Body Content
	modalBody.querySelector('#title').textContent = habit.title;
	modalBody.querySelector('#perday').textContent = habit.freq.day.per;
	modalBody.querySelector('#perweek').textContent = habit.freq.week.daysPer;
	// Dates
	const startDate = new Date(habit.createdAt);
	modalBody.querySelector('#startdate').textContent =
		startDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

	const weekDate = new Date(habit.freq.week.date);
	modalBody.querySelector('#thisweek').textContent = weekDate.toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
	);

	// Modal Footer
	cancelBtn.innerHTML = 'Cancel';
	cancelBtn.addEventListener('click', closeModal);
	modal.querySelector('#modal-footer #submit-btn').style.display = 'none';
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
