import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({ checked = false, indeterminate = false, onChange, label, description, disabled = false, style }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const on = checked || indeterminate;
  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        ref={(el) => { if (el) el.indeterminate = indeterminate; }}
        onChange={(e) => onChange && onChange(e.target.checked)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0, pointerEvents: 'none' }}
      />
      <span
        aria-hidden="true"
        style={{
          width: 16, height: 16, flex: 'none', marginTop: label ? 1 : 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: on ? 'var(--color-accent)' : 'var(--color-surface-2)',
          border: '1px solid ' + (on ? 'var(--color-accent)' : hover ? 'var(--color-border-input-hover)' : 'var(--color-border-input)'),
          borderRadius: 'var(--radius-sm)', color: 'var(--color-on-accent)', boxShadow: focus ? 'var(--focus-ring)' : 'none',
          transition: 'background var(--duration-fast) var(--ease-standard)',
        }}
      >
        {indeterminate ? <Icon name="minus" size={12} strokeWidth={2.5} /> : checked ? <Icon name="check" size={12} strokeWidth={2.5} /> : null}
      </span>
      {label ? (
        <span style={{ fontSize: 'var(--text-sm)', lineHeight: '18px', color: 'var(--color-text)' }}>
          {label}
          {description ? <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-text-3)', lineHeight: 1.4 }}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
