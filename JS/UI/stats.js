import { weeklyStats } from '../utils/helpers.js';
import { fetchHabits } from '../utils/storageHandler.js';

let ignore = false;

const renderStats = async (habits = null) => {
	if (ignore) return;
	ignore = true;

	if (!habits) habits = await fetchHabits();
	console.log('Stats Rendering.');

	//This Week
	const temp = document.getElementById('progress-circle-template');
	const weekStats = temp.content.cloneNode(true);

	// Avg
	const avgTemp = document.getElementById('progress-circle-template');
	const avgStats = avgTemp.content.cloneNode(true);
	weekStats.querySelector('.circle-cont h3').textContent = 'This Week';
	avgStats.querySelector('.circle-cont h3').textContent = 'Avg /week';

	// Calc
	const weekly = weeklyStats(habits);
	let value;
	let valueAll;

	if (!habits || habits.length === 0) {
		value = 0;
		valueAll = 0;
	} else {
		value = Math.round(Math.min(100, weekly.complete / weekly.total) * 100);
		valueAll =
			weekly.allTime.total === 0
				? 0
				: Math.round(
						Math.min(100, weekly.allTime.complete / weekly.allTime.total) * 100
				  );
		console.log(weekly);
	}

	// Render
	weekStats.querySelector('.inner-circle div div').textContent = `${value}`;
	avgStats.querySelector('.inner-circle div div').textContent = `${valueAll}`;
	weekStats.querySelector('.circle').style.background = `conic-gradient(
		#4caf50 calc(${value} * 1%),
		#e0e0e0 0
	)`;
	avgStats.querySelector('.circle').style.background = `conic-gradient(
		#4caf50 calc(${valueAll} * 1%),
		#e0e0e0 0
	)`;

	// Append to DOM
	const statsCol = document.querySelector('.weekly-stats');
	statsCol.innerHTML = '';
	statsCol.appendChild(weekStats);
	statsCol.appendChild(avgStats);

	ignore = false;
};

export default renderStats;
