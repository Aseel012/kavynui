// Applies the saved theme before first paint (kept external: the CSP allows no inline scripts).
try { if (localStorage.getItem('kavynui.theme') === 'light') document.documentElement.classList.add('light') } catch (e) { /* storage blocked */ }
