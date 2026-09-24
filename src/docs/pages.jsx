import { Link } from 'react-router-dom'
import { H2, P, C, Code, Note, Steps, Table, Tabs, SpringPlayground, ThemeLab } from './widgets'
import { Fit } from '@/site/Preview'
import HoldToConfirm from '@/kavyn/hold-to-confirm'
import FlipWords from '@/kavyn/flip-words'
import CacheRing from '@/kavyn/cache-ring'
import ShaderLattice from '@/kavyn/shader-lattice'

const THEME = `@import "tailwindcss";

@theme inline {
  --color-bg: var(--bg);
  --color-panel: var(--panel);
  --color-line: var(--line);
  --color-tx: var(--tx);
  --color-mute: var(--mute);
  --color-acc: var(--acc);
}

:root {
  --bg: #09090a;
  --panel: #0f0f11;
  --line: #1e1e22;
  --tx: #ededef;
  --mute: #8a8a93;
  --acc: #ff6a2b;
}`

const L = ({ to, children }) => <Link to={to} className="text-tx underline decoration-line2 underline-offset-4 hover:decoration-tx">{children}</Link>

function Live({ children, h = 'h-56' }) {
  return <div className={`relative mt-5 ${h} overflow-hidden rounded-2xl border border-line bg-bg`}><div className="grid-fade pointer-events-none absolute inset-0 opacity-40" /><Fit>{children}</Fit></div>
}

export const DOCS = [
  { group: 'Getting started', pages: [
    { id: 'introduction', title: 'Introduction', lead: 'Copy-paste motion components and page blocks for React.', toc: [['what', 'What you get'], ['principles', 'Principles'], ['next', 'Next steps']], body: () => (<>
      <Live h="h-48"><FlipWords /></Live>
      <H2 id="what">What you get</H2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[['Components', 'Buttons, type, loaders, navigation, 3D scenes. Each one does a job.', '/components'], ['Blocks', 'Full sections: dashboards, heroes, sign-in, status pages.', '/blocks'], ['Maps & data', 'Dotted world maps, globes, live charts and feeds.', '/components?family=data'], ['Backgrounds', 'Gradient backgrounds as plain CSS, with copyable code.', '/backgrounds']].map(([t, b, to]) => (
          <Link key={t} to={to} className="rounded-xl border border-line bg-panel p-4 transition-colors hover:border-line2"><div className="text-[15px] text-tx">{t}</div><p className="mt-1 text-sm text-mute">{b}</p></Link>
        ))}
      </div>
      <H2 id="principles">Principles</H2>
      <Table head={['Principle', 'In practice']} rows={[
        ['You own the code', 'No package to install. Copy a file into your project and edit it freely.'],
        ['Every piece has a use', 'Each component lists the real screen it was made for.'],
        ['Springs, not timers', 'Animations can be interrupted without jumping.'],
        ['Quiet by default', 'Dark, minimal tokens that pick up your brand color.'],
      ]} />
      <H2 id="next">Next steps</H2>
      <P>Set up a project in <L to="/docs/installation">Installation</L>, then add the tokens from <L to="/docs/theming">Theming</L>.</P>
    </>) },
    { id: 'installation', title: 'Installation', lead: 'React 18+, Tailwind CSS v4 and Motion. That is all.', toc: [['new', 'New project'], ['existing', 'Existing project'], ['next', 'Next.js']], body: () => (<>
      <H2 id="new">New project</H2>
      <Steps items={[['Create the app', 'Use Vite with the React template.'], ['Install dependencies', 'Motion for animation, Tailwind for styles.'], ['Add the Tailwind plugin', 'One line in vite.config.js.'], ['Add the theme tokens', 'Paste them into your main CSS file.']]} />
      <Code title="terminal" code={`npm create vite@latest my-app -- --template react\ncd my-app\nnpm i motion tailwindcss @tailwindcss/vite`} />
      <Code title="vite.config.js" code={`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\nimport { fileURLToPath } from 'node:url'\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },\n})`} />
      <H2 id="existing">Existing project</H2>
      <P>Already on Tailwind v4? Install <C>motion</C>, add the tokens, and start copying components into <C>src/components/kavyn/</C>. Keep the file names as shown on each page, because some components import each other (for example the maps share <C>world-dots.js</C>).</P>
      <H2 id="next">Next.js</H2>
      <P>Components use hooks and browser APIs, so mark each file as a client component.</P>
      <Code title="components/kavyn/hold-to-confirm.jsx" code={`'use client'\n\nimport { useState } from 'react'\n// ...rest of the component`} />
    </>) },
    { id: 'theming', title: 'Theming', lead: 'Nine color tokens. Change them once and every component follows.', toc: [['tokens', 'Tokens'], ['brand', 'Brand color'], ['light', 'Light mode']], body: () => (<>
      <H2 id="tokens">Tokens</H2>
      <ThemeLab />
      <Code title="src/index.css" code={THEME} />
      <H2 id="brand">Brand color</H2>
      <P>Most of the personality comes from <C>--color-acc</C>. Swap it for your brand color and keep the neutrals. Pick a color that still reads on a near-black background.</P>
      <H2 id="light">Light mode</H2>
      <P>Override the token values under a class. Components only read the tokens, so nothing else changes. This site ships a <C>.light</C> class and a toggle in the navbar.</P>
      <Code title="src/index.css" code={`.light {\n  --bg: #fafafa;\n  --panel: #ffffff;\n  --line: #e6e6ea;\n  --tx: #141417;\n  --mute: #5f5f6b;\n}`} />
    </>) },
    { id: 'usage', title: 'Usage', lead: 'Import, pass props, ship.', toc: [['basic', 'Basic'], ['props', 'Props'], ['compose', 'Composing']], body: () => (<>
      <Live><HoldToConfirm /></Live>
      <H2 id="basic">Basic</H2>
      <Code title="App.jsx" code={`import HoldToConfirm from '@/components/kavyn/hold-to-confirm'\n\nexport default function DangerZone() {\n  return <HoldToConfirm label="Hold to delete" onConfirm={() => deleteAccount()} />\n}`} />
      <H2 id="props">Props</H2>
      <P>Every prop has a default, so a component renders with no props at all. Each component page lists its props, read straight from the source.</P>
      <H2 id="compose">Composing</H2>
      <P>Blocks are built from components. Open the code for <L to="/components/edge-dashboard">Edge Dashboard</L> and you will see it imports <C>traffic-map.jsx</C>. Copy both files and it works.</P>
    </>) },
  ] },
  { group: 'Guides', pages: [
    { id: 'motion', title: 'Motion', lead: 'Springs keep their speed when interrupted, so nothing jumps. Tune one here.', toc: [['playground', 'Spring playground'], ['presets', 'Presets we use'], ['reduced', 'Reduced motion']], body: () => (<>
      <H2 id="playground">Spring playground</H2>
      <P>Drag the sliders. The curve is simulated from the same physics Motion uses, and the code below updates as you go.</P>
      <SpringPlayground />
      <H2 id="presets">Presets we use</H2>
      <Table head={['Name', 'stiffness', 'damping', 'Used for']} rows={[
        ['Snappy', '500', '34', 'Tabs, toggles, highlight pills'],
        ['Smooth', '260', '28', 'Page elements entering'],
        ['Bouncy', '320', '12', 'Celebrations, gooey buttons'],
        ['Heavy', '120 (mass 2.5)', '20', 'Large panels, sheets'],
      ]} />
      <Note tone="tip" title="Rule of thumb">Small things move fast and stop hard. Big things move slower with more mass.</Note>
      <H2 id="reduced">Reduced motion</H2>
      <P>Wrap your app in <C>MotionConfig</C> and Motion will respect the system setting. CSS animations in kavynUI also stop under <C>prefers-reduced-motion</C>.</P>
      <Code title="main.jsx" code={`import { MotionConfig } from 'motion/react'\n\n<MotionConfig reducedMotion="user">\n  <App />\n</MotionConfig>`} />
    </>) },
    { id: 'blocks', title: 'Blocks', lead: 'Blocks size themselves to their container, not the window.', toc: [['container', 'Container queries'], ['edit', 'Editing content']], body: () => (<>
      <H2 id="container">Container queries</H2>
      <P>Every block starts with Tailwind's <C>@container</C> class and uses <C>@3xl:</C> style variants. Put a block in a narrow sidebar and it switches to its mobile layout, even on a wide screen. Use the viewport switch on any block page to see it.</P>
      <Code title="pattern" code={`<section className="@container">\n  <div className="grid gap-3 @3xl:grid-cols-3">…</div>\n</section>`} />
      <H2 id="edit">Editing content</H2>
      <P>Text, lists and numbers are props or constants at the top of each file. Replace the demo data with yours; the names, quotes and numbers in the demos are made up.</P>
    </>) },
    { id: 'maps', title: 'Maps & data', lead: 'Dotted world maps and live widgets, drawn on canvas so they stay fast.', toc: [['map', 'World map'], ['live', 'Live data'], ['perf', 'Performance']], body: () => (<>
      <Live h="h-60"><CacheRing /></Live>
      <H2 id="map">World map</H2>
      <P><L to="/components/traffic-map">Traffic Map</L> and <L to="/components/edge-globe">Edge Globe</L> share <C>world-dots.js</C>: a 1.3 KB run-length mask of the land on a 2.5° grid, generated from Natural Earth. Pass your own locations as latitude and longitude.</P>
      <Code title="usage" code={`<TrafficMap hubs={[\n  { id: 'BOM', lat: 19.07, lon: 72.87 },\n  { id: 'FRA', lat: 50.11, lon: 8.68 },\n]} />`} />
      <H2 id="live">Live data</H2>
      <P>The widgets simulate data so they look alive in a demo. To show real numbers, replace the interval inside each component with your own fetch or websocket and keep the same state shape.</P>
      <H2 id="perf">Performance</H2>
      <P>Canvas components cap the device pixel ratio at 2 and stop drawing when unmounted. Interval-driven widgets skip updates while the tab is hidden.</P>
    </>) },
    { id: 'backgrounds', title: 'Backgrounds', lead: 'Gradients as plain CSS: no images, no JavaScript.', toc: [['use', 'Using one'], ['anim', 'Animated backgrounds']], body: () => (<>
      <H2 id="use">Using one</H2>
      <P>Open any background on the <L to="/backgrounds">Backgrounds</L> page and copy CSS, a Tailwind class or a React wrapper. Put your content inside; the background never captures clicks.</P>
      <H2 id="anim">Animated backgrounds</H2>
      <P>Animated ones move <C>background-position</C> or a registered custom property, which the browser can run cheaply. The copied CSS includes a reduced-motion rule.</P>
    </>) },
    { id: 'shaders', title: 'Shaders & scroll', lead: 'GPU backgrounds, scroll scenes and physics that degrade gracefully.', toc: [['shaders', 'Shader backgrounds'], ['fallback', 'Fallbacks'], ['scroll', 'Scroll scenes'], ['physics', 'Physics and cursor']], body: () => (<>
      <div className="relative mt-5 h-72 overflow-hidden rounded-2xl border border-line"><ShaderLattice><span className="text-sm font-medium text-tx">Your content here</span></ShaderLattice></div>
      <H2 id="shaders">Shader backgrounds</H2>
      <P>The <L to="/components?family=shaders">Shaders</L> family runs a small fragment shader through <C>gl-canvas.js</C>. Copy that file once; every shader imports it. Put content inside as children, the same way you use a CSS background.</P>
      <Code title="usage" code={`<ShaderInk from="#ff6a2b" to="#3b3bd6">\n  <h1>Launch day</h1>\n</ShaderInk>`} />
      <H2 id="fallback">Fallbacks</H2>
      <P>Each shader paints a CSS gradient first and fades the canvas in only once WebGL is running. If WebGL is off, blocked, software-only or lost mid-session, the gradient stays and nothing errors. Rendering starts below screen resolution and steps down further if frames run slow. The loop pauses off screen and in hidden tabs, and reduced motion renders one still frame.</P>
      <H2 id="scroll">Scroll scenes</H2>
      <P><L to="/components?family=scroll">Scroll Scenes</L> scroll inside their own box, so they work in a card, a modal or a full page. Size the box with <C>className</C>, for example <C>h-screen</C> for a full-page story.</P>
      <H2 id="physics">Physics and cursor</H2>
      <P>Canvas pieces share <C>canvas-loop.js</C>, which sizes the canvas, caps pixel ratio at 2, pauses off screen and tracks the pointer. Anything you can tap also works by keyboard or has a hidden list of real buttons.</P>
    </>) },
    { id: 'accessibility', title: 'Accessibility', lead: 'Motion should never be the only way to understand something.', toc: [['checklist', 'Checklist']], body: () => (<>
      <H2 id="checklist">Checklist</H2>
      <Table head={['Area', 'What kavynUI does']} rows={[
        ['Keyboard', 'Interactive parts are real buttons, links and inputs, with focus states.'],
        ['Reduced motion', 'Motion follows the system setting; CSS animations stop.'],
        ['Screen readers', 'Decorative canvases are hidden; charts and maps have labels.'],
        ['Hover', 'Anything that reacts to hover also reacts to tap or focus.'],
        ['Contrast', 'Body text (tx, mute) meets WCAG AA on the default background. faint is kept for non-essential labels.'],
      ]} />
    </>) },
  ] },
  { group: 'Reference', pages: [
    { id: 'resilience', title: 'Errors & networks', lead: 'What happens on a slow train, a dropped connection or a fresh deploy.', toc: [['boundaries', 'Error boundaries'], ['chunks', 'Retrying lazy chunks'], ['offline', 'Offline']], body: () => (<>
      <H2 id="boundaries">Error boundaries</H2>
      <P>This site wraps every page and every live preview in an error boundary. If one preview fails, you see a small retry button in its place and the rest of the page keeps working.</P>
      <H2 id="chunks">Retrying lazy chunks</H2>
      <P>Pages and previews load on demand. On a flaky network the import is retried with backoff, and it waits for the connection to return when the browser is offline. If a file is gone because a new version was deployed, the page reloads once to pick up the new files.</P>
      <Code title="lib/lazyRetry.js" code={`export async function importWithRetry(load, tries = 3) {\n  for (let i = 0; i < tries; i++) {\n    try { return await load() } catch (err) {\n      if (!navigator.onLine) await new Promise((r) => addEventListener('online', r, { once: true }))\n      else await new Promise((r) => setTimeout(r, 400 * 2 ** i))\n      if (i === tries - 1) throw err\n    }\n  }\n}`} />
      <H2 id="offline">Offline</H2>
      <P>When the connection drops, a small status pill appears at the bottom and anything already loaded keeps working. It confirms when you are back online.</P>
    </>) },
    { id: 'security', title: 'Security', lead: 'A static site with strict headers and nothing secret in the bundle.', toc: [['headers', 'Headers'], ['code', 'In the code']], body: () => (<>
      <H2 id="headers">Headers</H2>
      <Table head={['Header', 'Value / purpose']} rows={[
        ['Content-Security-Policy', "Scripts only from this site. No inline scripts, no eval, no framing."],
        ['Strict-Transport-Security', 'HTTPS only, for two years, including subdomains.'],
        ['X-Content-Type-Options', 'nosniff: files are used only as their declared type.'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin'],
        ['Permissions-Policy', 'Camera, microphone, location and payment are turned off.'],
        ['Cross-Origin-Opener-Policy', 'same-origin: other tabs cannot script this one.'],
      ]} />
      <P>The same headers ship in <C>vercel.json</C> and <C>public/_headers</C> (Cloudflare Pages and Netlify).</P>
      <H2 id="code">In the code</H2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-mute">
        <li>No <C>dangerouslySetInnerHTML</C>. Code samples are highlighted into plain React text nodes.</li>
        <li>External links open with <C>rel="noopener noreferrer"</C>, and only https and mailto links are allowed.</li>
        <li>Only <C>VITE_</C> variables reach the browser, and none of them are secrets.</li>
        <li>Inputs are length-limited and validated; URL parameters are checked against known values.</li>
      </ul>
    </>) },
  ] },
  { group: 'More', pages: [
    { id: 'faq', title: 'FAQ', lead: 'Short answers.', toc: [], body: () => (<>
      {[
        ['Is it free?', 'Yes. It is open source. See the Terms page for the license.'],
        ['Do I need a CLI?', 'No. Copy the file and install motion.'],
        ['Can I use it commercially?', 'Yes, under the license terms.'],
        ['Does it work with Next.js?', 'Yes. Add "use client" at the top of each component file.'],
        ['Is there a blog?', 'Yes - design and engineering notes live on the Blog page.'],
      ].map(([q, a]) => (
        <details key={q} className="group mt-3 rounded-xl border border-line bg-panel px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-tx">{q}<span className="text-faint transition-transform group-open:rotate-45">+</span></summary>
          <p className="mt-2 text-sm text-mute">{a}</p>
        </details>
      ))}
    </>) },
  ] },
]

export const FLAT = DOCS.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.group })))
