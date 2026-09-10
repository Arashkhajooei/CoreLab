import React, { useId } from 'react'

// CoreLab brand mark: a core sample under test. The strata bands echo the boring-log
// screen; the fill line rises and a measure line sweeps down, so the mark reads as
// "sample being tested" rather than sitting dead. Motion lives in icon-motion.css and
// is disabled under prefers-reduced-motion.
export function CoreLabMark({ size = 22, showWordmark = true }) {
  const clip = `cl-core-${useId().replace(/:/g, '')}`
  const body = 'M7 4.4h10v13.4a5 5 0 0 1-10 0z'
  return (
    <span className="cl-mark" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ flex: 'none', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <clipPath id={clip}>
            <path d={body} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect className="cl-mark-band cl-mark-band-1" x="6" y="3" width="12" height="5.2" fill="var(--color-accent)" />
          <rect className="cl-mark-band cl-mark-band-2" x="6" y="8.2" width="12" height="4.8" fill="var(--color-accent)" />
          <rect className="cl-mark-band cl-mark-band-3" x="6" y="13" width="12" height="7" fill="var(--color-accent)" />
          <rect className="cl-mark-scan" x="6" y="3" width="12" height="1.5" fill="var(--color-accent-text)" />
        </g>
        <path className="cl-mark-shell" d={body} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <ellipse className="cl-mark-rim" cx="12" cy="4.4" rx="5" ry="1.9" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      {showWordmark ? <span style={{ minWidth: 0 }}>CoreLab</span> : null}
    </span>
  )
}
