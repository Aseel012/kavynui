import { CopyButton } from './CodeBlock'
import { SITE } from '@/config'

export default function InstallCard({ name }) {
  const command = `npx shadcn@latest add @kavynui/${name}`
  const urlCommand = `npx shadcn@latest add ${SITE.url}/r/${name}.json`
  return (
    <section aria-label="Install component" className="mt-6 min-w-0 rounded-[22px] bg-panel p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-tx">Install with shadcn</h2>
        <span className="text-xs text-faint">React · Tailwind v4</span>
      </div>
      <div className="flex min-w-0 items-start gap-3 rounded-[14px] bg-bg p-3">
        <code className="min-w-0 flex-1 break-all font-mono text-[12px] leading-6 text-tx sm:text-[13px]">{command}</code>
        <CopyButton text={command} label="Copy command" className="mt-0.5" event="copy_install" data={{ slug: name, via: 'namespace' }} />
      </div>
      <p className="mt-3 text-xs leading-5 text-mute">Adds the component, its helper files, dependencies and theme tokens to your project. Listed in the <a href="https://ui.shadcn.com/docs/directory" target="_blank" rel="noreferrer" className="text-tx underline underline-offset-4">official shadcn registry directory</a>. Start with a <a href="https://ui.shadcn.com/docs/installation" target="_blank" rel="noreferrer" className="text-tx underline underline-offset-4">shadcn-initialized project</a>.</p>
      <details className="mt-4 text-xs text-mute">
        <summary className="cursor-pointer text-tx">Install from URL instead</summary>
        <div className="mt-3 flex min-w-0 items-start gap-2 rounded-[14px] bg-bg p-3">
          <code className="min-w-0 flex-1 break-all font-mono leading-5 text-tx">{urlCommand}</code>
          <CopyButton text={urlCommand} event="copy_install" data={{ slug: name, via: 'url' }} />
        </div>
      </details>
    </section>
  )
}
