const root = document.documentElement;
const button = document.querySelector('.invert');
const storedTheme = localStorage.getItem('portfolio-theme');

if (storedTheme === 'light') {
	root.dataset.theme = 'light';
	button?.setAttribute('aria-pressed', 'true');
}

button?.addEventListener('click', () => {
	const isLight = root.dataset.theme === 'light';
	root.dataset.theme = isLight ? 'dark' : 'light';
	button.setAttribute('aria-pressed', String(!isLight));
	localStorage.setItem('portfolio-theme', isLight ? 'dark' : 'light');
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
