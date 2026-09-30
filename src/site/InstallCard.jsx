import { CopyButton } from './CodeBlock'

export default function InstallCard({ name }) {
  const command = `npx shadcn@latest add https://kavynui.com/r/${name}.json`
  const namespace = '"registries": { "@kavynui": "https://kavynui.com/r/{name}.json" }'
  return (
    <section aria-label="Install component" className="mt-6 min-w-0 rounded-xl border border-line2 bg-panel p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-tx">Install with shadcn</h2>
        <span className="text-xs text-faint">React · Tailwind v4</span>
      </div>
      <div className="flex min-w-0 items-start gap-3 rounded-lg border border-line bg-bg p-3">
        <code className="min-w-0 flex-1 break-all font-mono text-[12px] leading-6 text-tx sm:text-[13px]">{command}</code>
        <CopyButton text={command} label="Copy command" className="mt-0.5" />
      </div>
      <p className="mt-3 text-xs leading-5 text-mute">Adds the component, its helper files, dependencies and theme tokens to your project. Start with a <a href="https://ui.shadcn.com/docs/installation" target="_blank" rel="noreferrer" className="text-tx underline underline-offset-4">shadcn-initialized project</a>.</p>
      <details className="mt-4 text-xs text-mute">
        <summary className="cursor-pointer text-tx">Use the @kavynui namespace</summary>
        <p className="mb-2 mt-3 leading-5">Merge this entry into your components.json registries object once:</p>
        <div className="flex min-w-0 items-start gap-2 rounded-lg border border-line bg-bg p-3">
          <code className="min-w-0 flex-1 break-all font-mono leading-5 text-tx">{namespace}</code>
          <CopyButton text={namespace} />
        </div>
        <div className="mt-2 flex min-w-0 items-start gap-2 rounded-lg border border-line bg-bg p-3">
          <code className="min-w-0 flex-1 break-all font-mono leading-5 text-tx">npx shadcn@latest add @kavynui/{name}</code>
          <CopyButton text={`npx shadcn@latest add @kavynui/${name}`} />
        </div>
      </details>
    </section>
  )
}
