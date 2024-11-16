import { fetchHabits } from '../utils/storageHandler.js';

document.addEventListener('DOMContentLoaded', () => {
	// Stats
	const statsToday = document.getElementById('stats-today');
	const statsWeek = document.getElementById('stats-week');
	const statsMonth = document.getElementById('stats-month');

	const habits = fetchHabits();

	//Stats for Today
	const todayTotal = habits;
});
