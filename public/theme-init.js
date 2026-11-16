// Applies the saved theme before first paint (kept external: the CSP allows no inline scripts).
// Sets .dark or .light on <html>; .dark is the shadcn convention, so installed components see the same classes here as in your app.
try { document.documentElement.classList.add(localStorage.getItem('kavynui.theme') === 'light' ? 'light' : 'dark') } catch (e) { document.documentElement.classList.add('dark') }

// Marks that JavaScript runs. index.html hides the static copy of the page (written by scripts/prerender.mjs
// for crawlers and AI agents) when this class is set, so people never see it flash before the app loads.
document.documentElement.classList.add('js')
