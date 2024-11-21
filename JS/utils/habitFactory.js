import { thisWeekStart, today } from './helpers.js';
import { fetchHabits } from './storageHandler.js';

const habitFactory = async ({ title, perDay, daysPerWeek }) => {
	// const perday = Number(perDay);
	// const dpw = Number(daysPerWeek);

	return {
		title,
		freq: {
			day: {
				per: perDay,
				date: today(),
				complete: 0,
			},
			week: {
				per: perDay * daysPerWeek,
				daysPer: daysPerWeek,
				date: thisWeekStart(),
				complete: 0,
			},
			allTime: {
				complete: 0,
				total: 0,
			},
		},
		createdAt: new Date(),
		id: await generateId(),
	};
};

const newId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const generateId = async () => {
	let id = newId();
	const existing = await fetchHabits();
	while (existing.some((el) => el.id === id)) {
		id = newId();
	}
	return id;
};

export default habitFactory;
