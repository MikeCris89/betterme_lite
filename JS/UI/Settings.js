import { closeModal, newModal, openModal } from '../app.js';
import { checkDates, clearData } from '../utils/storageHandler.js';
import { renderHabits } from './habits.js';

//let settings = [];

// const settClickOutside = (e) => {
// 	const sett = document.getElementById('settings');
// 	if (!sett.contains(e.target)) {
// 		hideSettings();
// 	}
// };

// const hideSettings = () => {
// 	const settIcon = document.getElementById('sett-icon');
// 	const sett = document.getElementById('settings');
// 	settIcon.classList.remove('fa-spin');
// 	sett.style.display = 'none';
// 	document.removeEventListener('click', settClickOutside);
// };

const toggleTheme = () => {
	const currTheme = document.documentElement.getAttribute('data-theme');
	const newTheme = currTheme === 'dark' ? 'light' : 'dark';
	document.documentElement.setAttribute('data-theme', newTheme);
	localStorage.setItem('theme', newTheme);
};

export const openSettings = () => {
	const modal = newModal();
	modal.querySelector('#modal-title').textContent = 'Settings';
	const modalBody = modal.querySelector('.modal-body');
	modalBody.innerHTML = `
	<div class="sett-menu">
		<div class="form-group sett-g">
			<p>Change Theme</p>
			<button id="theme-btn" class="theme-toggle-button">Theme</button>
		</div>
		<div class="form-group sett-g">
			<p>Change Date</p>
			<input type="datetime-local" id="test-date" />
		</div>
		<div class="form-group sett-g">
			<p>Clear All Data</p>
			<button id="clear-data">Clear Data</button>
		</div>
	</div>`;

	// Test Date
	const testDate = modal.querySelector('#test-date');
	if (testDate)
		testDate.addEventListener('input', () => {
			checkDates();
			renderHabits();
		});

	//submit btn
	modal.querySelector('#submit-btn').style.display = 'none';

	// Theme
	const themeBtn = modal.querySelector('#theme-btn');
	if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

	// Clear all data
	const clear = modal.querySelector('#clear-data');
	if (clear) clear.addEventListener('click', clearData);

	//Cancel Button
	const cancelBtn = modal.querySelector('#close-modal-btn');
	cancelBtn.addEventListener('click', closeModal);

	openModal(modal);
};
