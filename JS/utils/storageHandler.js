import { renderHabits } from '../UI/habits.js';
import { clearAllData, getData, saveData } from './api.js';
import { getProgressColor, thisWeekStart, today } from './helpers.js';

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
	const cardCont = document.querySelector(`.card-container#${habit.id}`);
	cardCont.classList.add('active');

	const habits = await fetchHabits();
	const newHabits = habits.map((el) => {
		if (el.id === habit.id) {
			let dayComplete = el.freq.day.complete + 1;
			let weekComplete = el.freq.week.complete + 1;

			cardCont.querySelector(
				'.habit-per-day'
			).textContent = `${dayComplete} / ${el.freq.day.per}`;
			const progressBar = cardCont.querySelector('.progress-bar');
			const progressValue = Math.min(100, (weekComplete / el.freq.week.per) * 100);
			progressBar.style.background = getProgressColor(progressValue, true);

			// Check Message
			cardCont.querySelector('.message-cont h2').textContent = '+1';
			cardCont.querySelector('.message-cont').classList.add('active');

			const newH = {
				...el,
				freq: {
					...el.freq,
					day: { ...el.freq.day, complete: dayComplete },
					week: {
						...el.freq.week,
						complete: weekComplete,
					},
				},
			};
			return newH;
		} else {
			return el;
		}
	});

	saveHabits(newHabits);
	setTimeout(() => {
		renderHabits();
	}, 1000);
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
