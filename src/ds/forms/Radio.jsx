import React, { useState } from 'react';

export function Radio({ name, value, checked = false, onChange, label, description, disabled = false, style }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange && onChange(value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0, pointerEvents: 'none' }}
      />
      <span
        aria-hidden="true"
        style={{
          width: 16, height: 16, flex: 'none', marginTop: label ? 1 : 0, borderRadius: 'var(--radius-full)',
          background: checked ? 'var(--color-accent)' : 'var(--color-surface-2)',
          border: '1.5px solid ' + (checked ? 'var(--color-accent)' : hover ? 'var(--color-border-input-hover)' : 'var(--color-border-input)'),
          boxShadow: (checked ? 'inset 0 0 0 3.5px var(--color-bg)' : 'none') + (focus ? ', var(--focus-ring)' : ''),
          transition: 'background var(--duration-fast) var(--ease-standard)',
        }}
      />
      {label ? (
        <span style={{ fontSize: 'var(--text-sm)', lineHeight: '18px', color: 'var(--color-text)' }}>
          {label}
          {description ? <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', lineHeight: 1.4 }}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
