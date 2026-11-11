// Applies the saved theme before first paint (kept external: the CSP allows no inline scripts).
// Sets .dark or .light on <html>; .dark is the shadcn convention, so installed components see the same classes here as in your app.
try { document.documentElement.classList.add(localStorage.getItem('kavynui.theme') === 'light' ? 'light' : 'dark') } catch (e) { document.documentElement.classList.add('dark') }
