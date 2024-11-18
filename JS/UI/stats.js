import { weeklyStats } from '../utils/helpers.js';
import { fetchHabits } from '../utils/storageHandler.js';

let ignore = false;

const renderStats = async (habits = null) => {
	if (ignore) return;
	ignore = true;

	if (!habits) habits = await fetchHabits();
	console.log('Stats Rendering.');
	// Stats
	const temp = document.getElementById('progress-circle-template');
	const statsCont = temp.content.cloneNode(true);
	const innerCircle = statsCont.querySelector('.circle .inner-circle p');
	innerCircle.textContent = 'weekly';

	const progCircle = document.getElementById('progress-circle');
	progCircle.innerHTML = '';
	//const statsWeek = document.getElementById('stats-week');

	const weekly = weeklyStats(habits);
	let value;

	if (!habits || habits.length === 0) {
		value = 0;
	} else {
		value = Math.min(100, weekly.complete / weekly.total) * 100;
		console.log(weekly);
	}

	document.documentElement.style.setProperty('--progress', value);

	//statsWeek.style.background = getProgressColor(value);
	progCircle.appendChild(statsCont);
	ignore = false;
};

export default renderStats;
