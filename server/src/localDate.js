function now() {
	const date = new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
	return Date(date).toLocaleString().slice(0, 24);
}

exports.now = now;