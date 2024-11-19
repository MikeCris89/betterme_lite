export const addElement = (el = 'div', classes = [], text = '') => {
	const newEl = document.createElement(el);
	classes.forEach((cl) => newEl.classList.add(cl));
	newEl.textContent = text;
	return newEl;
};

export const thisWeekStart = () => {
	const dateInput = document.getElementById('test-date');
	let thisWeek =
		dateInput && dateInput.value ? new Date(dateInput.value) : new Date();

	const dayOfWeek = thisWeek.getDay();
	thisWeek.setDate(thisWeek.getDate() - dayOfWeek);
	thisWeek.setHours(0, 0, 0, 0);
	return thisWeek.toISOString();
};

// export const thisMonthStart = () => {
// 	const dateInput = document.getElementById('test-date').value;
// 	const now = dateInput ? new Date(dateInput) : new Date();

// 	const start = new Date(now.getFullYear(), now.getMonth(), 1);

// 	return start;
// };

// export const daysInMonth = () => {
// 	const dateInput = document.getElementById('test-date').value;
// 	const now = dateInput ? new Date(dateInput) : new Date();
// 	const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
// 	return days;
// };

export const weeklyStats = (habits) => {
	let complete = 0;
	let total = 0;

	habits.forEach((habit) => {
		complete += habit.freq.week.complete;
		total += habit.freq.week.per;
	});

	return { complete, total };
};

export const today = () => {
	const dateInput = document.getElementById('test-date');
	let todayDate =
		dateInput && dateInput.value ? new Date(dateInput.value) : new Date();
	todayDate.setHours(0, 0, 0, 0);

	return todayDate.toISOString();
};

export const getProgressColor = (value = 0, blend = false) => {
	const blendValue = Math.min(100, value + 5);
	return `linear-gradient(to right, limegreen max(${value}%, 1%), white ${
		blend ? blendValue : value
	}%)`;
};
