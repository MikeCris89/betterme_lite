let fast = 250;
let med = 1000;
let slow = 3000;

let delay = fast;

export const getData = (key) => {
	return new Promise((res, rej) => {
		setTimeout(() => {
			try {
				const data = JSON.parse(localStorage.getItem(key));
				res(data);
			} catch (e) {
				rej(e);
			}
		}, delay);
	});
};

export const saveData = (key, data) => {
	return new Promise((res, rej) => {
		try {
			localStorage.setItem(key, JSON.stringify(data));
			res('success');
		} catch (e) {
			rej(e);
		}
	});
};

export const clearAllData = () => {
	return new Promise((res, rej) => {
		try {
			localStorage.clear();
			res('success');
		} catch (e) {
			rej(e);
		}
	});
};
