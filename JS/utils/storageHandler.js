import { fetchHabits, renderHabits, saveHabits } from '../UI/habits.js';
import { clearAllData, getData, saveData } from './api.js';
import { thisWeekStart, today } from './helpers.js';

export const clearData = async () => {
	try {
		await clearAllData();
		console.log('data cleared');
	} catch (e) {
		console.error('Error clearing data. Error: ', e.message);
	}
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
				saveHabits(resp);
				renderHabits();
			});
		}
	} catch (e) {
		console.error('Error checking dates. Error: ', e.message);
	}
};
