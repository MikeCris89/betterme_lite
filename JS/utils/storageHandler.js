import renderHabits from '../UI/habits.js';
import { thisWeekStart, today } from './helpers.js';

let dataCache = null;

export const fetchHabits = () => {
	if (!dataCache) {
		console.log('Fetching from local storage.');
		const data = JSON.parse(localStorage.getItem('habits')) || [];
		dataCache = data;
		return data;
	}

	return dataCache;
};

export const saveHabits = (habitArr) => {
	dataCache = habitArr;
	localStorage.setItem('habits', JSON.stringify(habitArr));
};

export const clearData = () => {
	console.log('data cleared');
	localStorage.clear();
	dataCache = null;
	renderHabits();
};

export const deleteHabit = (id) => {
	const habits = fetchHabits();
	const newHabits = habits.filter((habit) => habit.id !== id);
	saveHabits(newHabits);
	renderHabits();
};

// TODO
// adjust the monthly and alltime totals
export const checkOff = (habit) => {
	const habits = fetchHabits();
	const newHabits = habits.map((el) =>
		el.id === habit.id
			? {
					...el,
					progress: {
						...el.progress,
						day: { ...el.progress.day, complete: el.progress.day.complete + 1 },
						week: {
							...el.progress.week,
							complete: el.progress.week.complete + 1,
						},
						total: el.progress.total + 1,
					},
			  }
			: el
	);
	saveHabits(newHabits);
	renderHabits();
};

// Check habits for dates daily / weekly
const resetDailyProgress = (habits, thisDay) =>
	habits.map((habit) =>
		habit.progress.day.date !== thisDay
			? {
					...habit,
					progress: {
						...habit.progress,
						day: { date: thisDay, complete: 0 },
					},
			  }
			: habit
	);

const resetWeeklyProgress = (habits, thisWeek) =>
	habits.map((habit) =>
		habit.progress.week.date !== thisWeek
			? {
					...habit,
					progress: {
						...habit.progress,
						week: { date: thisWeek, complete: 0 },
					},
			  }
			: habit
	);

const setDates = (thisDay, thisWeek) => {
	return {
		day: thisDay,
		week: thisWeek,
	};
};

export const checkDates = () => {
	let dates = JSON.parse(localStorage.getItem('dates'));
	const thisDay = today();
	const thisWeek = thisWeekStart();

	if (!dates) {
		dates = setDates(thisDay, thisWeek);
		localStorage.setItem('dates', JSON.stringify(dates));
	}

	if (dates.day !== thisDay || dates.week !== thisWeek) {
		let habits = fetchHabits();
		if (habits.length > 0) {
			if (dates.day !== thisDay) {
				habits = resetDailyProgress(habits, thisDay);
			}
			if (dates.week !== thisWeek) {
				habits = resetWeeklyProgress(habits, thisWeek);
			}
		}
		dates = setDates(thisDay, thisWeek);
		localStorage.setItem('dates', JSON.stringify(dates));
		console.log(habits);
		saveHabits(habits);
	}
};
