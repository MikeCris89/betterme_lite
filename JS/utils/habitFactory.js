import {
	daysInMonth,
	freqPerMonth,
	thisMonthStart,
	thisWeekStart,
	today,
} from './helpers.js';
import { fetchHabits } from './storageHandler.js';

const habitFactory = ({ title, perDay, daysPerWeek }) => {
	return {
		title,
		progress: {
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
			month: {
				per: freqPerMonth(perDay, daysPerWeek),
				date: thisMonthStart(),
				complete: 0,
			},
			allTime: { total: 0, complete: 0 },
		},
		createdAt: new Date(),
		id: generateId(),
	};
};

const newId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const generateId = () => {
	let id = newId();
	const existing = fetchHabits();
	while (existing.some((el) => el.id === id)) {
		id = newId();
	}
	return id;
};

export default habitFactory;
