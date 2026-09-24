// A single light beam travels around the card edge. Good for the one card you want seen.
export default function BeamBorder({ children, speed = 4, color = '#ff6a2b', className = '' }) {
  return (
    <div className={`relative w-[340px] max-w-full overflow-hidden rounded-2xl p-px ${className}`}>
      <style>{`@property --kv-a{syntax:'<angle>';initial-value:0deg;inherits:false}@keyframes kv-beam{to{--kv-a:360deg}}`}</style>
      <div className="absolute inset-0 rounded-2xl" style={{ background: `conic-gradient(from var(--kv-a), transparent 0 78%, ${color} 90%, transparent 100%)`, animation: `kv-beam ${speed}s linear infinite` }} />
      <div className="absolute inset-0 rounded-2xl border border-line2" />
      <div className="relative rounded-[15px] bg-panel p-6">
        {children ?? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-mute">Workers</span>
              <span className="rounded-full bg-acc/15 px-2 py-0.5 text-[11px] text-acc">Recommended</span>
            </div>
            <div className="mt-4 font-mono text-3xl tracking-tight text-tx">12 ms</div>
            <p className="mt-1 text-sm text-mute">Median cold start across 300 cities.</p>
          </>
        )}
      </div>
    </div>
  )
}
