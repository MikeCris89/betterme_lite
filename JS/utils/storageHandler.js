import { renderHabits } from '../UI/habits.js';
import { clearAllData, getData, saveData } from './api.js';
import { thisWeekStart, today } from './helpers.js';

let allHabits = null;

export const fetchHabits = async () => {
	if (allHabits) return allHabits;

	console.log('Fetching from local storage.');
	try {
		allHabits = getData('habits').then((resp) => {
			const data = resp || [];
			if (data.length > 0) {
				//const newData = data.map((el) => ({...el, el.freq.day.per : Number(el.freq.day.per)}))
			}
			allHabits = data;
			return data;
		});
		return allHabits;
	} catch (e) {
		console.error('Fetch Habits Error:', e);
		return [];
	}
};

export const saveHabits = async (habitArr) => {
	try {
		allHabits = habitArr;
		await saveData('habits', habitArr);
		console.log('Habits saved.');
	} catch (e) {
		console.error('Error saving habits. Error: ', e.message);
	}
};

export const clearData = async () => {
	try {
		allHabits = null;
		renderHabits();

		await clearAllData();
		console.log('data cleared');
	} catch (e) {
		console.error('Error clearing data. Error: ', e.message);
	}
};

export const deleteHabit = async (id) => {
	const habits = await fetchHabits();
	const newHabits = habits.filter((habit) => habit.id !== id);
	await saveHabits(newHabits);
	console.log('Habit Deleted.');
	renderHabits();
};

export const checkOff = async (habit) => {
	const habits = await fetchHabits();
	const newHabits = habits.map((el) =>
		el.id === habit.id
			? {
					...el,
					freq: {
						...el.freq,
						day: { ...el.freq.day, complete: el.freq.day.complete + 1 },
						week: {
							...el.freq.week,
							complete: el.freq.week.complete + 1,
						},
					},
			  }
			: el
	);
	await saveHabits(newHabits);
	renderHabits();
};

// Check habits for dates daily / weekly
const resetDailyProgress = (habits, thisDay) =>
	habits.map((habit) =>
		habit.freq.day.date !== thisDay
			? {
					...habit,
					freq: {
						...habit.freq,
						day: { ...habit.freq.day, date: thisDay, complete: 0 },
					},
			  }
			: habit
	);

const resetWeeklyProgress = (habits, thisWeek) => {
	const newHabits = habits.map((habit) => {
		if (!habit.allTime)
			habit = {
				...habit,
				freq: { ...habit.freq, allTime: { complete: 0, total: 0 } },
			};
		return habit.freq.week.date !== thisWeek
			? {
					...habit,
					freq: {
						...habit.freq,
						week: { ...habit.freq.week, date: thisWeek, complete: 0 },
						allTime: {
							...habit.freq.allTime,
							total: habit.freq.allTime.total + habit.freq.week.per,
							complete: habit.freq.allTime.complete + habit.freq.week.complete,
						},
					},
			  }
			: habit;
	});

	return newHabits;
};

const setDates = (thisDay, thisWeek) => {
	return {
		day: thisDay,
		week: thisWeek,
	};
};

export const checkDates = async () => {
	console.log('Checking dates');
	try {
		let dates = await getData('dates');
		const thisDay = today();
		const thisWeek = thisWeekStart();

		if (!dates) {
			dates = setDates(thisDay, thisWeek);
			saveData('dates', dates);
		}

		if (dates.day !== thisDay || dates.week !== thisWeek) {
			fetchHabits().then(async (resp) => {
				if (resp.length > 0) {
					if (dates.day !== thisDay) {
						resp = resetDailyProgress(resp, thisDay);
					}
					if (dates.week !== thisWeek) {
						resp = resetWeeklyProgress(resp, thisWeek);
					}
				}
				dates = setDates(thisDay, thisWeek);
				saveData('dates', dates);
				console.log('Dates Modified');
				await saveHabits(resp);
				renderHabits();
			});
		}
	} catch (e) {
		console.error('Error checking dates. Error: ', e.message);
	}
};
