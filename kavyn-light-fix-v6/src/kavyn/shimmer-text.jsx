'use client'

// A light band sweeps across muted text. For "thinking" and in-progress labels.
export default function ShimmerText({ children = 'Generating preview…', speed = 2.2, className = '' }) {
  return (
    <span className={`relative inline-block text-lg font-medium tracking-tight ${className}`}>
      <style>{`@keyframes kv-shimmer{from{background-position:150% 0}to{background-position:-50% 0}}`}</style>
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: 'linear-gradient(100deg, var(--faint) 35%, var(--tx) 50%, var(--faint) 65%)',
          backgroundSize: '220% 100%',
          animation: `kv-shimmer ${speed}s linear infinite`,
        }}
      >{children}</span>
    </span>
  )
}
