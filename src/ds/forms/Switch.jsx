import React, { useState } from 'react';

export function Switch({ checked = false, onChange, label, description, disabled = false, size = 'md', style }) {
  const [focus, setFocus] = useState(false);
  const w = size === 'sm' ? 28 : 34, h = size === 'sm' ? 16 : 20, knob = h - 6;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0, pointerEvents: 'none' }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'relative', width: w, height: h, flex: 'none', borderRadius: 'var(--radius-full)',
          background: checked ? 'var(--color-accent)' : 'var(--color-surface-3)',
          border: '1px solid ' + (checked ? 'var(--color-accent)' : 'var(--color-border-input)'),
          boxShadow: focus ? 'var(--focus-ring)' : 'none',
          transition: 'background var(--duration-fast) var(--ease-standard)',
        }}
      >
        <span style={{ position: 'absolute', top: 2, left: checked ? w - knob - 4 : 2, width: knob, height: knob, borderRadius: 'var(--radius-full)', background: checked ? 'var(--color-on-accent)' : 'var(--color-text-2)', transition: 'left var(--duration-fast) var(--ease-standard)' }} />
      </span>
      {label ? (
        <span style={{ fontSize: 'var(--text-sm)', lineHeight: h + 'px', color: 'var(--color-text)' }}>
          {label}
          {description ? <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', lineHeight: 1.4 }}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
